const Event = require('../models/event');
const express = require('express');
const router = express.Router();

router.post('/events', (req, res) => {
  const event = new Event({
    event: req.body.event,
    start: req.body.start,
    end: req.body.end,
    description: req.body.description
  });
  
  event
    .save()
    .then(newEvent => {
      res.send(newEvent);
    })
    
  
});

router.get('/events', (req, res) => {
  Event.find()
  .then(events => {
    res.json(events);
  })
})


module.exports = router;