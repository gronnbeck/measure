var request = require('superagent');

class LocationsQuery {
  query(callback) {
    request
      .get('/locations')
      .end((err, res) => {
        if (err) { throw Error('Could not find locations endpoint') }
        else {
          const locations = JSON.parse(res.text);
          callback(locations)
        }
      });
  }
}

module.exports = LocationsQuery;
