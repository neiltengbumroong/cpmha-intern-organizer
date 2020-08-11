const mongoose = require('mongoose');

const internSchema = mongoose.Schema({
  name: String,
  email: String,
  school: String,
  major: String,
  joined: Date,
  tasks: [{
    task: String,
    id: String
  }],
  weeklyHours: Number,
  totalHours: Number,
  teams: [{
    name: String,
    id: String
  }]
});

module.exports = Intern = mongoose.model('intern', internSchema);