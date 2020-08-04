const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: String,
  members: [String],
  leader: String,
  description: String
});

module.exports = Team = mongoose.model('team', teamSchema);