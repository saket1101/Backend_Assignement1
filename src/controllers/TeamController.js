const User = require("../models/UserModel");
const Team = require("../models/TeamModel");
const mongoose = require("mongoose");

const createTeam = async (req, res) => {
    try {
      const { name, managerId, members } = req.body;
  
      // Validate required fields
      if (!name || !managerId || !Array.isArray(members)) {
        return res.status(400).json({
          success: false,
          message: "Name, managerId, and members array are required.",
        });
      }
  
      // Validate manager's role
      const manager = await User.findById(managerId);
      if (!manager || manager.role !== "manager") {
        return res.status(403).json({
          success: false,
          message: "Only managers are allowed to create a team.",
        });
      }
  
      // Convert member IDs to ObjectId and validate them
      const membersObjectIds = members.map((member) => {
        if (mongoose.Types.ObjectId.isValid(member.user)) {
          return { user: new mongoose.Types.ObjectId(member.user) };
        } else {
          throw new Error(`Invalid ObjectId: ${member.user}`);
        }
      });
  
      // Check if any member is an admin
      const invalidMembers = await User.find({
        _id: { $in: membersObjectIds.map((m) => m.user) },
        role: "admin",
      }).select("name email");
  
      if (invalidMembers.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Admins cannot be added to a team as members.",
          invalidMembers,
        });
      }
  
      // Create the team
      const team = new Team({
        name,
        manager: managerId,
        members: membersObjectIds,
      });
  
      await team.save();
  
      res.status(201).json({
        success: true,
        message: "Team created successfully.",
        team,
      });
    } catch (error) {
      console.error("Error in createTeam:", error.message);
      res.status(500).json({
        success: false,
        message: error.message || "Internal server error.",
      });
    }
  };

const getAllTeams = async (req, res) => {
    try {
      const { id, role } = req.user; 
  
      let teams;
  
      if (role === "admin") {
        // If the user is an admin, fetch all teams
        teams = await Team.find()
          .populate("manager", "name email")
          .populate("members.user", "name email role");
      } else if (role === "manager") {
        // If the user is a manager, fetch only their teams
        teams = await Team.find({ manager: id })
          .populate("manager", "name email")
          .populate("members.user", "name email role");
      } else {
        return res.status(403).json({
          success: false,
          message: "You are not authorized to view teams",
        });
      }
  
      res.status(200).json({
        success: true,
        message: "Teams fetched successfully",
        teams,
      });
    } catch (error) {
      console.error("Error in getAllTeams:", error.message);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  ;

const getSingleTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const team = await Team.findById(id)
      .populate("manager", "name email")
      .populate("members.user", "name email role");

    if (!team) {
      return res
        .status(404)
        .json({ success: false, message: "Team not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Team fetched successfully", team });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createTeam, getAllTeams, getSingleTeam };
