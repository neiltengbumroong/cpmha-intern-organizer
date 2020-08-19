const Task = require('../models/Task');
const express = require('express');
const router = express.Router();

// standard task creation route
router.post('/api/tasks/post', (req, res) => {
  const task = new Task({
    task: req.body.task,
    deadline: req.body.deadline,
    dateAssigned: req.body.dateAssigned,
    assignedTo: req.body.assignedTo,
    assignedToTeam: req.body.assignedToTeam,
    completed: false,
    description: req.body.description,
    link: req.body.link
  });

  task
    .save()
    .then(newTask => {
      res.send(newTask);
    }) 
});

// delete task by id
router.post('/api/tasks/delete', (req, res) => {
  Task.findByIdAndDelete(req.body.id)
    .then(deleted => {
      res.json(deleted);
    })
});

// return all tasks
router.get('/api/tasks/get', (req, res) => {
  Task.find().sort({'deadline': -1})
  .then(tasks => {
    res.json(tasks);
  })
});

router.post('/api/tasks/toggle/completed', (req, res) => {
  Task.updateOne(
    { _id: req.body.taskId },
    { $set:
      {
        completed: req.body.completed
      }
    }
  )
  .then(updatedTask => {
    res.send(updatedTask);
  })
});

// standard get for a single task
router.post('/api/tasks/get/single', (req, res) => {
  Task.findById(req.body.id)
  .then(task => {
    res.json(task);
  })
});

// edit task
router.post('/api/tasks/update', (req, res) => {
  Task.updateOne(
    { _id: req.body.id },
    { $set:
      {
        task: req.body.task,
        deadline: req.body.deadline,
        assignedTo: req.body.assignedTo,
        assignedToTeam: req.body.assignedToTeam,
        description: req.body.description,
        link: req.body.link
      }
    }
  )
  .then(updatedTask => {
    res.send(updatedTask);
  })
});

// remove single intern from task 
router.post('/api/tasks/delete/intern', (req, res) => {
  Task.findByIdAndUpdate(
    { _id: req.body.taskId },
    { $pull: { assignedTo: { id: req.body.internId } } },
    (err, task) => {
      res.send(task);
    }
  )
});

// remove single team from task
router.post('/api/tasks/delete/team', (req, res) => {
  Task.findByIdAndUpdate(
    { _id: req.body.internId },
    { $pull: { assignedToTeam: { id: req.body.teamId } } },
    (err, task) => {
      res.send(task);
    }
  )
});



module.exports = router;
