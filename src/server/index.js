var express = require('express');
var session = require('express-session');
var mongoose = require('mongoose');
var request = require('superagent');
var passport = require('passport');
var InstagramStrategy = require('passport-instagram').Strategy;
var fetch = require('./api/fetch');
var Location = require('./models/location');
var logger = require('./utils/logger');

var config = {
  port: 8037,
  INSTAGRAM_CLIENT_ID: process.env.INSTAGRAM_CLIENT_ID,
  INSTAGRAM_CLIENT_SECRET: process.env.INSTAGRAM_CLIENT_SECRET,
  cookieSecret: '123456789',
  mongooseUri: process.env.MONGOLAB_URI
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


app.use('/fetch', fetch);
app.get('/locations', function(req, res) {
  Location.find({}, function(err, locations) {
    if (err) {
      return res.send('No locations found')
    }
    return res.send(locations);
  });
});

app.use('/js', express.static('build/app'))
app.use('/', express.static('build/public'));

app.listen(config.port, function() {
  logger.message('Server is running at port ' + config.port);
});
