const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { v4: uuidv4 } = require("uuid");

const runCode = async (req, res) => {
  try {
    const { code } = req.body;

    const fileId = uuidv4();

    const filePath = path.join(__dirname, `${fileId}.js`);

    fs.writeFileSync(filePath, code);

    exec(`node "${filePath}"`, (error, stdout, stderr) => {
      fs.unlinkSync(filePath);

      if (error) {
        return res.json({
          output: stderr || error.message,
        });
      }

      res.json({
        output: stdout || "No output",
      });
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  runCode,
};