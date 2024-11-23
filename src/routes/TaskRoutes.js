/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management APIs
 */
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
/**
 * @swagger
 * /createTask:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the task
 *               description:
 *                 type: string
 *                 description: Description of the task
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: Due date of the task
 *               priority:
 *                 type: string
 *                 enum: ['Low', 'Medium', 'High']
 *                 description: Priority of the task
 *               status:
 *                 type: string
 *                 enum: ['Pending', 'In Progress', 'Completed', 'On Hold', 'Cancelled']
 *                 description: Status of the task
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
router.post('/createTask', createTask);

/**
 * @swagger
 * /getTasks:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *         description: Filter tasks by status
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *         description: Filter tasks by priority
 *       - in: query
 *         name: sortField
 *         schema:
 *           type: string
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks
 *       500:
 *         description: Server error
 */
router.get('/getTasks', getTasks);

/**
 * @swagger
 * /updateTask:
 *   put:
 *     summary: Update an existing task
 *     tags: [Tasks]
 *     parameters:
 *       - in: body
 *         name: task
 *         required: true
 *         description: Task details to be updated
 *         schema:
 *           type: object
 *           properties:
 *             taskId:
 *               type: string
 *               description: ID of the task to be updated
 *             title:
 *               type: string
 *               description: Title of the task
 *             description:
 *               type: string
 *               description: Description of the task
 *             dueDate:
 *               type: string
 *               format: date
 *               description: Due date of the task
 *             priority:
 *               type: string
 *               enum: [low, medium, high]
 *               description: Priority of the task
 *             status:
 *               type: string
 *               enum: [pending, in-progress, completed]
 *               description: Status of the task
 *     responses:
 *       200:
 *         description: Task updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.put('/updateTask',  updateTask);

/**
 * @swagger
 * /deleteTask:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: taskId
 *         required: true
 *         description: The ID of the task to be deleted
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */
router.delete('/deleteTask', deleteTask);

// Admin/Manager APIs
/**
 * @swagger
 * /getAllTask:
 *   get:
 *     summary: Get all tasks (Admin/Manager)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         description: Filter tasks by status
 *         schema:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *       - in: query
 *         name: priority
 *         required: false
 *         description: Filter tasks by priority
 *         schema:
 *           type: string
 *           enum: [low, medium, high]
 *     responses:
 *       200:
 *         description: Successfully retrieved tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       403:
 *         description: Forbidden (User is not an admin or manager)
 *       500:
 *         description: Server error
 */
router.get('/getAllTask', verifyRole(['admin', 'manager']), getAllTaskByAdmin);


/**
 * @swagger
 * /assignTaskByAdmin:
 *   put:
 *     summary: Assign a task by an Admin or Manager
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: assignTask
 *         required: true
 *         description: Details for assigning a task
 *         schema:
 *           type: object
 *           properties:
 *             taskId:
 *               type: string
 *               description: ID of the task to assign
 *             userId:
 *               type: string
 *               description: ID of the user to assign the task to
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden (User is not authorized)
 *       500:
 *         description: Server error
 */
router.put('/assignTaskByAdmin', verifyRole(['admin', 'manager']), assignTaskByAdmin);

/**
 * @swagger
 * /updateTaskForUser:
 *   put:
 *     summary: Update a task for a user by Admin or Manager
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: updateTaskForUser
 *         required: true
 *         description: Task details for updating by Admin or Manager
 *         schema:
 *           type: object
 *           properties:
 *             taskId:
 *               type: string
 *               description: ID of the task to update
 *             title:
 *               type: string
 *               description: Title of the task
 *             description:
 *               type: string
 *               description: Description of the task
 *             dueDate:
 *               type: string
 *               format: date
 *               description: Due date of the task
 *             priority:
 *               type: string
 *               enum: [low, medium, high]
 *               description: Priority of the task
 *             status:
 *               type: string
 *               enum: [pending, in-progress, completed]
 *               description: Status of the task
 *     responses:
 *       200:
 *         description: Task updated successfully for user
 *       400:
 *         description: Invalid input
 *       403:
 *         description: Forbidden (User is not authorized)
 *       500:
 *         description: Server error
 */
router.put("/updateTaskForUser",verifyRole(["admin", "manager"]),updateTaskForAdminOrManager);

module.exports = router;
