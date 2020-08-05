const Team = require('../models/team');
const express = require('express');
const router = express.Router();

// post a new team 
router.post('/api/teams/post', (req, res) => {
  const team = new Team({
    name: req.body.name,
    members: req.body.members,
    leader: req.body.leader,
    description: req.body.description
  });
  
  team
    .save()
    .then(newTeam => {
      res.send(newTeam);
    })
});

// standard get route for all teams
router.get('/api/teams/get', (req, res) => {
  Team.find()
  .then(team => {
    res.json(team);
  })
})

// push intern onto members array for intern
router.post('/api/team/update-members', (req, res) => {
  Team.findOneAndUpdate(
    { _id: req.body.id },
    { $push: { members: req.body.internId } },
    (err, intern) => {
      res.send(intern);
    }
  )
})


module.exports = router;