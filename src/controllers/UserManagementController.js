const User = require("../models/UserModel");


const getAllUsers = async (req,res) => {
    try {
        const allUsers = await User.find().select("-password").exec();
        res.status(200).json({
            success: true,
            message: "All User profile fetched successfully",
            data: allUsers,
        });
    } catch (error) {
        console.log("Error in getAllUser", error.message);
        res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
}

const getSingleUser = async (req, res) => {
    try {
        const id = req.user.id;
        const user = await User.findById(id).select("-password").exec()
        res.status(200).json({ success: true, message: "User fetched successfully", data: user })
    } catch (error) {
        console.error("Error in getSingleUser", error.message);
        res.status(500).json({
            success: false,
            messsage: "An internal server error occured."
        })
    }
}

module.exports = { getAllUsers, getSingleUser }