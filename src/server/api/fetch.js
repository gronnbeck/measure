var express = require('express');
var Location = require('../models/location');
var logger = require('../utils/logger');
var MyMediaQuery = require('../query/instagram-mymedia-query');

var app = express();

app.get('/instagram', function (req, res) {
  var user = req.user;
  const query = new MyMediaQuery(user);
  query.query().then((locations) => {
    locations.forEach(function(l) {
      Location.findOrCreate(l, function(err, location) {
        if (err) {
          logger.debug('Could not save: ' + err);
        }
      });
    });
    res.send('fetching data');
  },
  (err) => res.send('An error occured'));
});

module.exports = app;
