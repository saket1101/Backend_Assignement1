const express = require('express');
const router = express.Router();
const Auth = require('../middleware/AuthMiddleware');
const verifyRole = require('../middleware/RoleMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTaskByAdmin,
  assignTaskByAdmin,
} = require('../controllers/TaskController');

// User APIs
router.post('/createTask', Auth, createTask);
router.get('/getTasks', Auth, getTasks);
router.put('/updateTask', Auth, updateTask);
router.delete('/deleteTask', Auth, deleteTask);

// Admin/Manager APIs
router.get('/getAllTask', Auth, verifyRole(['admin', 'manager']), getAllTaskByAdmin);
router.put('/assignTaskByAdmin', Auth, verifyRole(['admin', 'manager']), assignTaskByAdmin);

module.exports = router;
