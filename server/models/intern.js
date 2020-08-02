const mongoose = require('mongoose');

const internSchema = mongoose.Schema({
  name: String,
  email: String,
  school: String,
  major: String,
  joined: String,
  pendingTasks: [String], // array of IDs from task collection
  completedTasks: [String], // array of IDs from task collection
  weeklyHours: Number,
  totalHours: Number,
  teams: [String]
});

module.exports = Intern = mongoose.model('intern', internSchema);