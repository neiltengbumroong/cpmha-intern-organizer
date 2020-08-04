const Team = require('../models/team');
const express = require('express');
const router = express.Router();

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

router.get('/api/teams/get', (req, res) => {
  Team.find()
  .then(team => {
    res.json(team);
  })
})


module.exports = router;