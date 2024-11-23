
const User = require("../models/UserModel");

const assignRole = async (req, res) => {
    try {
        const id = req.params.id;
        const { role } = req.body;
        const avlroles = ['admin', 'manager', 'user']
        if (!avlroles.includes(role)) {
            return res.status(400).json({ success: false, message: `Plz provide valid roles ${avlroles.join(",")}` })
        }
        const findUser = await User.findById(id).exec()
        if (!findUser) {
            return res.status(400).json({ success: false, message: "User not found" })
        }
        if (findUser.role === role) {
            return res.status(400).json({ success: false, message: "This role is already assigned to user" })
        }
        findUser.role = role;
        await findUser.save();

        res.status(200).json({ success: true, message: "Role Successfully assigned" })
    } catch (error) {
        console.error("Error in role assign", error.message)
        return res.status(500).send("Internal Server error")
    }
}

module.exports = {assignRole}