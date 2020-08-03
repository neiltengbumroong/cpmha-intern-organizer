const Task = require('../models/Task');
const express = require('express');
const router = express.Router();

router.post('/tasks', (req, res) => {
  const task = new Task({
    task: req.body.task,
    deadline: req.body.deadline,
    priority: req.body.priority,
    dateAssigned: req.body.dateAssigned,
    assignedTo: req.body.assignedTo,
    completed: req.body.completed,
  });
  
  task.save();
  
});

router.get('/tasks', (req, res) => {
  Task.find()
  .then(tasks => {
    res.json(tasks);
  })
})


module.exports = router;
