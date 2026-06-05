const express = require("express");
const router = express.Router();

const {
  createProject,
  getProjects,
  getProjectById,
  addFile,
  updateFileContent,
  inviteMember,
} = require("../controllers/projectController");

router.post("/create", createProject);
router.get("/:userId", getProjects);
router.get("/project/:id", getProjectById);
router.post("/add-file", addFile);
router.put("/update-file", updateFileContent);
router.post("/invite", inviteMember);

module.exports = router;