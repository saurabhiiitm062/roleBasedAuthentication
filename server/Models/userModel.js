const mongoose = require("mongoose");

const UserAuth = new mongoose.Schema(
  {
    email: String,
    password: String,
    role: {
      type: String,
      enum: ["user", "moderator", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

const userModel = mongoose.model("User", UserAuth);
module.exports = userModel;
