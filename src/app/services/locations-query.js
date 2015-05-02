var request = require('superagent');

class LocationsQuery {
  query() {
    return new Promise((resolve, reject) => {
      request
        .get('/locations')
        .end((err, res) => {
          if (err) { reject('Could not find locations endpoint') }
          else {
            const locations = JSON.parse(res.text);
            resolve(locations)
          }
        });
    });
  }
}

module.exports = LocationsQuery;
