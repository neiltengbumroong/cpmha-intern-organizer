const mongoose = require('mongoose');

const internSchema = mongoose.Schema({
  name: String,
  email: String,
  school: String,
  major: String,
  joined: Date,
  tasks: [String],
  weeklyHours: Number,
  totalHours: Number,
  teams: [String]
});

module.exports = Intern = mongoose.model('intern', internSchema);