const mongoose = require('mongoose');

const announceSchema = mongoose.Schema({
  subject: String,
  name: String,
  announcement: String,
  date: Date
});

module.exports = Announce = mongoose.model('announce', announceSchema);