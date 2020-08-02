const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: String,
  members: [String]
});

module.exports = Team = mongoose.model('team', teamSchema);