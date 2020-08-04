const Intern = require('../models/intern');
const express = require('express');
const router = express.Router();

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
  
  intern.save();
  
});

// standard get for all interns
router.get('/api/interns/get', (req, res) => {
  Intern.find()
  .then(interns => {
    res.json(interns);
  })
})

// push task onto tasks array for intern
router.post('/api/interns/update/task', (req, res) => {
  Intern.findOneAndUpdate(
    { _id: req.body.id },
    { $push: { tasks: req.body.taskId } },
    (err, intern) => {
      res.send(intern);
    }
  )
})




module.exports = router;