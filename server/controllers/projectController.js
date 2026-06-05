const Project = require("../models/Project");
const User = require("../models/User");

const createProject = async (req, res) => {
  try {
    const { name, ownerId } = req.body;

    const project = await Project.create({
      name,
      owner: ownerId,
      members: [ownerId],
      files: [],
    });

    await User.findByIdAndUpdate(ownerId, {
      $push: { projects: project._id },
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    const { userId } = req.params;

    const projects = await Project.find({
      members: userId,
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addFile = async (req, res) => {
  try {
    const { projectId, name, type } = req.body;

    const project = await Project.findById(projectId);

    project.files.push({
      name,
      type,
      content: "",
      children: [],
    });

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateFileContent = async (req, res) => {
  try {
    const { projectId, fileName, content } = req.body;

    const project = await Project.findById(projectId);

    const file = project.files.find(
      (f) => f.name === fileName && f.type === "file"
    );

    if (!file) {
      return res.status(404).json({
        message: "File not found",
      });
    }

    file.content = content;

    await project.save();

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const inviteMember = async (req, res) => {
  try {
    const { projectId, email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const project = await Project.findById(projectId);

    if (!project.members.includes(user._id)) {
      project.members.push(user._id);

      await User.findByIdAndUpdate(user._id, {
        $push: { projects: project._id },
      });

      await project.save();
    }

    res.json({
      message: "Member added successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  addFile,
  updateFileContent,
  inviteMember,
};