const Intern = require('../models/intern');
const express = require('express');
const router = express.Router();


// post a single intern
router.post('/api/interns/post', (req, res) => {
  const intern = new Intern({
    name: req.body.name,
    email: req.body.email,
    school: req.body.school,
    major: req.body.major,
    joined: req.body.joined,
    tasks: req.body.tasks,
    weeklyHours: 0,
    totalHours: 0,
    teams: req.body.teams
  });
  
  intern.save()
    .then(newIntern =>{
      res.send(newIntern);
    })
  
});

// standard get for all interns
router.get('/api/interns/get', (req, res) => {
  Intern.find()
  .then(interns => {
    res.json(interns);
  })
})

// standard get for a single intern
router.post('/api/interns/get/single', (req, res) => {
  Intern.findById(req.body.id)
  .then(intern => {
    res.json(intern);
  })
})

// push task onto tasks array for intern
router.post('/api/interns/add-task', (req, res) => {
  Intern.findOneAndUpdate(
    { _id: req.body.internId },
    { $push: { tasks: req.body.taskId } },
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
router.post('/api/interns/add-team', (req, res) => {
  Intern.findOneAndUpdate(
    { _id: req.body.internId },
    { $push: { teams: req.body.teamId } },
    (err, intern) => {
      res.send(intern);
    }
  )
});

// remove single task from intern
router.post('/api/interns/delete-task', (req, res) => {
  Intern.findByIdAndUpdate(
    { _id: req.body.internId },
    { $pull: { tasks: req.body.taskId } },
    (err, team) => {
      res.send(team);
    }
  )
});

// remove single team from intern
router.post('/api/interns/delete-team', (req, res) => {
  Intern.findByIdAndUpdate(
    { _id: req.body.internId },
    { $pull: { teams: req.body.teamId } },
    (err, team) => {
      res.send(team);
    }
  )
});




module.exports = router;