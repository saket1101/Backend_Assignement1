const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "manager", "user"],
      default: "user",
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
