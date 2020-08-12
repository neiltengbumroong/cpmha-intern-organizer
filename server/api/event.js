const Event = require('../models/event');
const express = require('express');
const router = express.Router();

// standard creation for events
router.post('/api/events/post', (req, res) => {
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

// update an event
router.post('/api/events/update', (req, res) => {
  Event.updateOne(
    { _id: req.body.id },
    { $set: 
      { event: req.body.event,
        start: req.body.start,
        end: req.body.end,
        description: req.body.description
      }
    }
  )
  .then(newEvent => {
    res.send(newEvent);
  })
})

//delete an event
router.post('/api/events/delete', (req, res) => {
  Event.findByIdAndDelete(req.body.id)
    .then(deleted => {
      res.send(deleted);
    })
})

// standard get for single events
router.post('/api/events/get/single', (req, res) => {
  Event.findById(req.body.id)
    .then(event => {
      res.send(event);
    })
})

//standard get for all events
router.get('/api/events/get', (req, res) => {
  Event.find()
  .then(events => {
    res.json(events);
  })
})


module.exports = router;