const Task = require('../models/Task');
const Team = require('../models/Team');
const User = require('../models/User');

// Create Task (Users can create tasks for themselves)
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      assignedBy: req.user.id, 
      assignedTo: req.user.id, 
    });

    await task.save();
    res.status(201).json({ success: true, message: 'Task created successfully', task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Tasks for Logged-In User
const getTasks = async (req, res) => {
    try {
      const { status, priority, dueDate, sortField, sortOrder } = req.query;
  
      const query = { assignedTo: req.user.id };
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (dueDate) query.dueDate = { $lte: new Date(dueDate) };
  
      const sortOptions = {};
      if (sortField) {
        sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1; 
      }
  
      const tasks = await Task.find(query).sort(sortOptions);
  
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Update Task
const updateTask = async (req, res) => {
  try {
    const { taskId, ...updates } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, assignedTo: req.user.id },
      updates,
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.body;

    const task = await Task.findOneAndDelete({ _id: taskId, assignedTo: req.user.id });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin/Manager: Get All Tasks
const getAllTaskByAdmin = async (req, res) => {
    try {
      const { role } = req.user;
      const { status, priority, dueDate, sortField, sortOrder } = req.query;
  
      let query = {};
      if (role === 'manager') {
        const team = await Team.findOne({ manager: req.user.id });
        if (team) query.team = team._id;
      }
      if (status) query.status = status;
      if (priority) query.priority = priority;
      if (dueDate) query.dueDate = { $lte: new Date(dueDate) };
  
      const sortOptions = {};
      if (sortField) {
        sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;
      }
  
      const tasks = await Task.find(query)
        .populate('assignedTo assignedBy', 'name email')
        .sort(sortOptions);
  
      res.status(200).json({ success: true, tasks });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  

// Assign Task by Admin or Manager
const assignTaskByAdmin = async (req, res) => {
  try {
    const { taskId, assignedTo } = req.body;
    const { role, id: userId } = req.user;

    if (role === 'manager') {
      const team = await Team.findOne({ manager: userId }).populate('members.user');
      if (!team || !team.members.some(member => member.user.equals(assignedTo))) {
        return res.status(403).json({ success: false, message: 'You can only assign tasks within your team' });
      }
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo },
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({ success: true, message: 'Task assigned successfully', task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTaskByAdmin,
  assignTaskByAdmin,
};
