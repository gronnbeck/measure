var mongoose = require('mongoose');
var findOrCreate = require('mongoose-findorcreate')

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

module.exports = Location;
