var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var request = require('superagent');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;

var config = {
  port: 8037,
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
  cookieSecret: '123456789',
  mongooseUri: process.env.MONGOLAB_URI
};

var InstagramEndpoints = function() {
  this.media = {
    recent: function(userId, accessToken) {
      var urlTemplate = 'https://api.instagram.com/v1/users/{user_id}/media/recent/?access_token={access_token}';
      var url = urlTemplate.replace('{user_id}', userId)
        .replace('{access_token}', accessToken);

      return url;
    }
  }

  return this;
};

var logger = {
  message: function(message) {
    console.log(message);
  },
  debug: function(level, message) {
    if (level != null && message == null) {
      message = level;
      level = 'Unknown';
    }
    console.log(message);
  }
};

mongoose.connect(config.mongooseUri)

var InstagramSchema = {
  id: { type: String },
  token: { type: String }
};

var findOrCreate = require('mongoose-findorcreate')
var UserSchema = mongoose.Schema({
  username: { type: String, lowercase: true },
  instagram: InstagramSchema
});
UserSchema.plugin(findOrCreate);
var User = mongoose.model('User', UserSchema);

var LocationSchema = mongoose.Schema({
  latitude: Number,
  longitude: Number,
  name: String,
  source: String,
  id: String,
  _id: String
});
LocationSchema.plugin(findOrCreate);
var Location = mongoose.model('Location', LocationSchema);

passport.use(new InstagramStrategy({
    clientID: config.INSTAGRAM_CLIENT_ID,
    clientSecret: config.INSTAGRAM_CLIENT_SECRET,
    callbackURL: "http://localhost:8037/auth/instagram/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOne({ 'instagram.id': profile.id }, function (err, user) {
      if (err) {
        logger.debug('User was not found. Creating new');
        var userModel = new User({
          'instagram.id': profile.id,
          'instagram.token': accessToken
        });
        return userModel.save(function(err) {
          if (err) {
            throw new Error('Could not save user. Mongo instance down?');
          }
          done(null, user);
        });
      }

      logger.debug('Found user updating accesstoken')
      user.instagram.token = accessToken;
      return user.save(function(err) {
        if (err) {
          throw new Error('Could not save user. Mongo instance down?');
        }
        done(null, user);
      });
    });
  }
));

var app = express();
app.use(session( { secret: config.cookieSecret }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


app.get('/auth/instagram', passport.authenticate('instagram'));

app.get('/auth/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get('/fetch/instagram', function (req, res) {
  var user = req.user;
  var endpoints = new InstagramEndpoints();
  var url = endpoints.media.recent(user.instagram.id, user.instagram.token);
  request
  .get(url)
  .end(function(err, result) {
    if (err) {
      return res.send('An error occured');
    }
    var body = result.text;
    var json = JSON.parse(body);
    var data = json.data;
    var locations = data.map(function(d) {
      if (d.location == null) return null;
      return {
        latitude: d.location.latitude,
        longitude: d.location.longitude,
        name: d.location.name,
        source: 'instagram',
        id: d.id,
        _id: 'instagram' + '.' + d.id
      }
    });
    locations.forEach(function(l) {
      Location.findOrCreate(l, function(err, location) {
        if (err) {
          logger.debug('Could not save: ' + err);
        }
      });
    });
    res.send('fetching data');
  });

  app.get('/locations', function(req, res) {
    Location.find({}, function(err, locations) {
      if (err) {
        return res.send('No locations found')
      }
      return res.send(locations);
    });
  });

});

app.listen(config.port, function() {
  logger.message('Server is running at port ' + config.port);
});
