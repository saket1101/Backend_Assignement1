const User = require("../models/UserModel");
const Team = require("../models/TeamModel")


const createTeam = async (req, res) => {
    try {
        const { name, managerId, members } = req.body;

        const team = new Team({
            name,
            manager: managerId,
            members,
        });

        await team.save();
        res.status(201).json({ success: true, message: 'Team created successfully', team });
    } catch (error) {
        console.log("Error in team creation")
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

const getAllTeams = async (req, res) => {
    try {
        const teams = await Team.find()
            .populate('manager', 'name email')
            .populate('members.user', 'name email role');

        res.status(200).json({ success: true, message: "All teams successfully fetched", teams });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const getSingleTeam = async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id)
            .populate('manager', 'name email')
            .populate('members.user', 'name email role');

        if (!team) {
            return res.status(404).json({ success: false, message: 'Team not found' });
        }

        res.status(200).json({ success: true, message: "Team fetched successfully", team });
    } catch (error) {
        console.log(error.message)
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

module.exports = { createTeam, getAllTeams, getSingleTeam }