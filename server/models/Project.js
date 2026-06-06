const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  type: {
    type: String,
    enum: ["file", "folder"],
    required: true,
  },

  content: {
    type: String,
    default: "",
  },

  children: [this],
});

const historySchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },

  userName: {
    type: String,
    required: true,
  },

  action: {
    type: String,
    required: true,
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const versionSchema = new mongoose.Schema({
  fileName: String,
  content: String,
  userName: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    role: {
      type: String,
      enum: ["Admin", "Editor", "Viewer"],
      default: "Viewer",
    },
  },
],

    files: [fileSchema],

    history: [historySchema],

    versions: [versionSchema],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Project",
  projectSchema
);