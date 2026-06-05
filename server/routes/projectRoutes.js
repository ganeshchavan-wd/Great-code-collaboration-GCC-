const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  addFile,
  updateFileContent,
  inviteMember,
  deleteFile,
} = require("../controllers/projectController");

router.post("/create", createProject);

router.get("/:userId", getProjects);

router.get("/project/:id", getProjectById);

router.post("/add-file", addFile);

router.put("/update-file", updateFileContent);

router.post("/invite", inviteMember);

router.delete("/delete-file", deleteFile);

module.exports = router;