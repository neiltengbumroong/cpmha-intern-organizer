const mongoose = require('mongoose');

const taskSchema = mongoose.Schema({
  task: String,
  deadline: Date,
  priority: String,
  dateAssigned: Date,
  assignedTo: [String], 
  completed: Boolean,
  links: [String]
});

module.exports = Task = mongoose.model('task', taskSchema);