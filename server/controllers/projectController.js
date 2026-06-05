const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
  try {
    const { name, ownerId } = req.body;

    const project = await Project.create({
      name,
      owner: ownerId,
      members: [],
      files: [],
      history: [],
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({
      $or: [
        { owner: userId },
        { members: userId },
      ],
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(
      req.params.id
    );

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addFile = async (req, res) => {
  try {
    const {
      projectId,
      name,
      type,
      userName,
    } = req.body;

    const project =
      await Project.findById(projectId);

    project.files.push({
      name,
      type,
      content: "",
      children: [],
    });

    project.history.push({
      fileName: name,
      userName: userName || "Unknown User",
      action: "Created File",
      timestamp: new Date(),
    });

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateFileContent = async (
  req,
  res
) => {
  try {
    const {
      projectId,
      fileName,
      content,
      userName,
    } = req.body;

    const project =
      await Project.findById(projectId);

    const file = project.files.find(
      (f) =>
        f.name === fileName &&
        f.type === "file"
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    file.content = content;

    project.history.push({
      fileName,
      userName:
        userName || "Unknown User",
      action: "Saved File",
      timestamp: new Date(),
    });

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const deleteFile = async (
  req,
  res
) => {
  try {
    const {
      projectId,
      fileName,
      userName,
    } = req.body;

    const project =
      await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    project.files =
      project.files.filter(
        (file) =>
          file.name !== fileName
      );

    project.history.push({
      fileName,
      userName:
        userName || "Unknown User",
      action: "Deleted File",
      timestamp: new Date(),
    });

    await project.save();

    res.json({
      message:
        "File deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const inviteMember = async (
  req,
  res
) => {
  try {
    const {
      projectId,
      email,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const project =
      await Project.findById(projectId);

    const alreadyMember =
      project.members.some(
        (member) =>
          member.toString() ===
          user._id.toString()
      );

    if (!alreadyMember) {
      project.members.push(user._id);

      project.history.push({
        fileName: "-",
        userName: email,
        action: "Joined Project",
        timestamp: new Date(),
      });

      await project.save();
    }

    res.json({
      message:
        "Member added successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addFile,
  updateFileContent,
  deleteFile,
  inviteMember,
};