const Intern = require('../models/intern');
const express = require('express');
const router = express.Router();

router.post('/interns', (req, res) => {
  const intern = new Intern({
    name: req.body.name,
    email: req.body.email,
    school: req.body.school,
    major: req.body.major,
    joined: req.body.joined,
    pendingTasks: [],
    completedTasks: [],
    weeklyHours: 0,
    totalHours: 0
  });
  
  intern.save()
    .then(doc => {
      console.log(doc);
    })
  
});

router.get('/interns', (req, res) => {
  Intern.find()
  .then(interns => {
    res.json(interns);
  })
})




module.exports = router;