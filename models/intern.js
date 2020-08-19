const mongoose = require('mongoose');
const Double = require('@mongoosejs/double');

const internSchema = mongoose.Schema({
  name: String,
  email: String,
  school: String,
  major: String,
  phone: String,
  joined: Date,
  work: [{
    work: String,
    hours: Double,
    date: Date
  }],
  tasks: [{
    task: String,
    id: String
  }],
  totalHours: Double,
  teams: [{
    name: String,
    id: String
  }]
});

module.exports = Intern = mongoose.model('intern', internSchema);