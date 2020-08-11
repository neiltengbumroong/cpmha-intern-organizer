const mongoose = require('mongoose');

const teamSchema = mongoose.Schema({
  name: String,
  members: [{
    name: String,
    id: String
  }],
  leader: { name: String, id: String },
  description: String,
  tasks: [{
    task: String,
    id: String
  }]
});

module.exports = Team = mongoose.model('team', teamSchema);