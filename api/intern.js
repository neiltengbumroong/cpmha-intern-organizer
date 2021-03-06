const Intern = require('../models/intern');
const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 10 * 1000, 
  max: 1
});


// post a single intern
router.post('/api/interns/post', (req, res) => {
  const intern = new Intern({
    name: req.body.name,
    email: req.body.email,
    school: req.body.school,
    major: req.body.major,
    phone: req.body.phone,
    joined: req.body.joined,
    tasks: [],
    teams: [],
    totalHours: 0
  });
  
  intern.save()
    .then(newIntern => {
      res.send(newIntern);
    })
  
});

// standard get for all interns
router.get('/api/interns/get', (req, res) => {
  Intern.find()
  .then(interns => {
    res.json(interns);
  })
});

// standard get for a single intern
router.post('/api/interns/get/single', (req, res) => {
  Intern.findById(req.body.id)
  .then(intern => {
    res.json(intern);
  })
})

// update intern
router.post('/api/interns/update', (req, res) => {
  Intern.updateOne(
    { _id : req.body.id },
    { $set: 
      { name: req.body.name,
        school: req.body.school,
        major: req.body.major,
        email: req.body.email,
        joined: req.body.joined,
        phone: req.body.phone
      }
    }
  )
  .then(newIntern => {
    res.send(newIntern);
  })
})

// update intern's activity
router.post('/api/interns/update/work', apiLimiter, (req, res) => {
  Intern.findOneAndUpdate(
    { _id: req.body.id },
    { 
      $push: { work: req.body.workObject },
      $inc: { totalHours: req.body.workObject.hours} 
    },
    (err, intern) => {
      res.send(intern);
    }
  )
});

// push task onto tasks array for intern
router.post('/api/interns/add/task', (req, res) => {
  Intern.findOneAndUpdate(
    { _id: req.body.internId },
    { $push: { tasks: req.body.taskObject } },
    (err, intern) => {
      res.send(intern);
    }
  )
});

// delete intern by id
router.post('/api/interns/delete', (req, res) => {
  Intern.findByIdAndDelete(req.body.id)
    .then(deleted => {
      res.json(deleted);
    })
});

// push team onto teams array for intern
router.post('/api/interns/add/team', (req, res) => {
  Intern.findOneAndUpdate(
    { _id: req.body.internId },
    { $addToSet: { teams: req.body.teamObject } },
    (err, intern) => {
      res.send(intern);
    }
  )
});

// remove single task from intern
router.post('/api/interns/delete/task', (req, res) => {
  Intern.findByIdAndUpdate(
    { _id: req.body.internId },
    { $pull: { tasks: { id: req.body.taskId } } },
    (err, team) => {
      res.send(team);
    }
  )
});

// remove single team from intern
router.post('/api/interns/delete/team', (req, res) => {
  Intern.findByIdAndUpdate(
    { _id: req.body.internId },
    { $pull: { teams: { id: req.body.teamId } } },
    (err, team) => {
      res.send(team);
    }
  )
});




module.exports = router;