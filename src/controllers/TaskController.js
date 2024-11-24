const Task = require("../models/TaskModel");
const Team = require("../models/TeamModel");
const User = require("../models/UserModel");

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
    res
      .status(201)
      .json({ success: true, message: "Task created successfully", task });
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
      sortOptions[sortField] = sortOrder === "desc" ? -1 : 1;
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
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    req.io.emit("updateTaskEvent", {
      data: task,
    });
    res
      .status(200)
      .json({ success: true, message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Task
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.body;

    const task = await Task.findOneAndDelete({
      _id: taskId,
      assignedTo: req.user.id,
    });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
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
    if (role === "manager") {
      const team = await Team.findOne({ manager: req.user.id });
      if (team) query.team = team._id;
    }
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (dueDate) query.dueDate = { $lte: new Date(dueDate) };

    const sortOptions = {};
    if (sortField) {
      sortOptions[sortField] = sortOrder === "desc" ? -1 : 1;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo assignedBy", "name email")
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

    // Fetch task and assigned user in a single query
    const [task, user] = await Promise.all([
      Task.findById(taskId),
      User.findById(assignedTo),
    ]);

    // Check if task or user exists
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Manager role check: Ensure manager assigns within their team
    if (role === "manager") {
      const team = await Team.findOne({ manager: userId }).populate(
        "members.user"
      );
      if (
        !team ||
        !team.members.some((member) => member.user.equals(assignedTo))
      ) {
        return res.status(403).json({
          success: false,
          message: "You can only assign tasks within your team",
        });
      }
    }

    // Update task assignment
    task.assignedTo = assignedTo;
    await task.save();

    req.io.emit("updateTaskEvent", { data: task });

    res
      .status(200)
      .json({ success: true, message: "Task assigned successfully", task });
  } catch (error) {
    console.error("Error in assigning task:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Admin can update any task; Manager can update tasks for team members only
const updateTaskForAdminOrManager = async (req, res) => {
  try {
    const { taskId, updates } = req.body;
    const { role, id: userId } = req.user;

    if (!taskId || !updates) {
      return res.status(400).json({
        success: false,
        message: "Task ID and updates are required",
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (role === "manager") {
      const team = await Team.findOne({ manager: userId });
      if (!team) {
        return res.status(403).json({
          success: false,
          message: "You are not managing any team.",
        });
      }

      if (!team.members.includes(task.assignedTo.toString())) {
        return res.status(403).json({
          success: false,
          message: "You can only update tasks for your team members.",
        });
      }
    }

    Object.assign(task, updates);
    await task.save();
    req.io.emit("updateTaskEvent", { data: task });

    res.status(200).json({
      success: true,
      message: "Task updated successfully.",
      task,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getTaskAnalytics = async (req, res) => {
  try {
    const { userId, teamId } = req.query;

    let match = {};

    if (userId) {
      match.assignedTo = userId;
    }

    // if teamId is provided then get task for all the mmembers of the team
    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team) {
        return res
          .status(404)
          .json({ success: false, message: "Team not found" });
      }
      match.assignedTo = { $in: team.members.map((member) => member.user) };
    }

    // fetch tasks and aggregate analytics data basen on user or team
    const tasks = await Task.aggregate([
      { $match: match }, // filter tasks based on the provided match conditions
      {
        $group: {
          _id: "$assignedTo", // Group tasks by assigned user
          totalTasks: { $sum: 1 }, // Count total tasks
          completedTasks: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }, // Count completed tasks
          },
          pendingTasks: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }, // Count pending tasks
          },
          overdueTasks: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$status", "pending"] },
                    { $lt: ["$dueDate", new Date()] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $project: {
          _id: 0,
          user: { $arrayElemAt: ["$userDetails.username", 0] },
          totalTasks: 1,
          completedTasks: 1,
          pendingTasks: 1,
          overdueTasks: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Task analytics fetched successfully",
      data: tasks,
    });
  } catch (error) {
    console.error("Error fetching task analytics:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error while fetching task analytics",
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  getAllTaskByAdmin,
  assignTaskByAdmin,
  updateTaskForAdminOrManager,
  getTaskAnalytics,
};
