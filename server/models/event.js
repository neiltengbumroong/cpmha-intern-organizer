const mongoose = require('mongoose');

const eventSchema = mongoose.Schema({
  event: String,
  start: Date,
  end: Date,
  description: String
});

module.exports = Event = mongoose.model('event', eventSchema);