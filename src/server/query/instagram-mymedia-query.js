var request = require('superagent');

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

class InstagramMyMediaQuery {
  constructor(user) {
      this.user = user;
  }

  query() {
    var user = this.user;
    var endpoints = new InstagramEndpoints();
    var url = endpoints.media.recent(user.instagram.id, user.instagram.token);
    return new Promise((resolve, reject) => {
      request
      .get(url)
      .end(function(err, result) {
        if (err) {
          return reject(err);
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
        resolve(locations);
      });
    })
  }
}

module.exports = InstagramMyMediaQuery;
