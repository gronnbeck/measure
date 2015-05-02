var express = require('express');
var request = require('superagent');
var Location = require('../models/location');
var logger = require('../utils/logger');

var app = express();

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


app.get('/instagram', function (req, res) {
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
});

module.exports = app;
