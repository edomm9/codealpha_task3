const mongoose = require("mongoose");
const Schema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please enter group name"],
    },
    password: {
      type: String,
      required: true,
      default: 0,
    },
    project: {
      type: String,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);
const Group = mongoose.model("Group", Schema);
module.exports = Group;
