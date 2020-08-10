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
});

// standard get for a single task
router.post('/api/teams/get/single', (req, res) => {
  Team.findById(req.body.id)
  .then(team => {
    res.json(team);
  })
});

// push intern onto members array for intern
router.post('/api/team/add-members', (req, res) => {
  console.log("adding member: ", req.body.internId);
  Team.findOneAndUpdate(
    { _id: req.body.id },
    { $addToSet: { members: req.body.internId } },
    (err, intern) => {
      res.send(intern);
    }
  )
});

// delete team by id
router.post('/api/teams/delete', (req, res) => {
  Team.findByIdAndDelete(req.body.id)
    .then(deleted => {
      res.json(deleted);
    })
});

// edit team
router.post('/api/teams/update', (req, res) => {
  Team.updateOne(
    { _id: req.body.id },
    { $set:
      {
        name: req.body.name,
        members: req.body.members,
        leader: req.body.leader,
        description: req.body.description
      }
    }
  )
  .then(newTeam => {
    res.send(newTeam);
  })
})

// push task onto tasks array for team
router.post('/api/teams/add-task', (req, res) => {
  Team.findOneAndUpdate(
    { _id: req.body.teamId },
    { $push: { tasks: req.body.taskId } },
    (err, team) => {
      res.send(team);
    }
  )
});

// remove single intern from team 
router.post('/api/teams/delete-intern', (req, res) => {
  Team.findByIdAndUpdate(
    { _id: req.body.teamId },
    { $pull: { members: req.body.internId } },
    (err, task) => {
      res.send(task);
    }
  )
});

// remove single task from team
router.post('/api/teams/delete-task', (req, res) => {
  Team.findByIdAndUpdate(
    { _id: req.body.teamId },
    { $pull: { tasks: req.body.taskId } },
    (err, team) => {
      res.send(team);
    }
  )
});


module.exports = router;