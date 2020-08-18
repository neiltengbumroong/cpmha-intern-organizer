const Announce = require('../models/announce');
const express = require('express');
const router = express.Router();

// post a single announcement
router.post('/api/announcements/post', (req, res) => {
  console.log("posting announcement: ", req.body);
  const announce = new Announce({
    subject: req.body.subject,
    name: req.body.name,
    announcement: req.body.announcement,
    date: req.body.date
  });
  
  announce.save()
    .then(newAnnounce => {
      res.send(newAnnounce);
    })
});

// standard get for all announcements
router.get('/api/announcements/get', (req, res) => {
  Announce.find()
  .then(announcements => {
    res.json(announcements);
  })
});

// standard get for all announcements
router.get('/api/announcements/get/recent', (req, res) => {
  Announce.find().sort({'date': -1 }).limit(10)
  .then(announcements => {
    res.json(announcements);
  })
});

module.exports = router;