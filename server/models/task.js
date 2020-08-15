const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  task: String,
  deadline: Date,
  dateAssigned: Date,
  description: String,
  assignedTo: [{
    name: String,
    id: String
  }],
  assignedToTeam: [{
    name: String,
    id: String
  }],
  completed: Boolean,
  link: String
});

module.exports = Task = mongoose.model('task', taskSchema);