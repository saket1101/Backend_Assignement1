const express = require('express');
const router = express.Router();
const verifyRole = require('../middleware/RoleMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTaskByAdmin,
  assignTaskByAdmin,updateTaskForAdminOrManager
} = require('../controllers/TaskController');

// User APIs
router.post('/createTask', createTask);
router.get('/getTasks', getTasks);
router.put('/updateTask',  updateTask);
router.delete('/deleteTask', deleteTask);

// Admin/Manager APIs
router.get('/getAllTask', verifyRole(['admin', 'manager']), getAllTaskByAdmin);
router.put('/assignTaskByAdmin', verifyRole(['admin', 'manager']), assignTaskByAdmin);
router.put("/updateTaskForUser",verifyRole(["admin", "manager"]),updateTaskForAdminOrManager);

module.exports = router;
