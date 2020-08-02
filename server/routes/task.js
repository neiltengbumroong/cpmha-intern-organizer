const Task = require('../models/Task');
const express = require('express');
const router = express.Router();

router.post('/tasks', (req, res) => {
  const task = new Task({
    name: req.body.task,
    deadline: req.body.deadline,
    priority: req.body.priority,
    dateAssigned: req.body.dateAssigned,
    assignedTo: req.body.assignedTo,
    completed: req.body.completed,
  });
  
  task.save()
  .then(doc => console.log(doc))
  
});


module.exports = router;
