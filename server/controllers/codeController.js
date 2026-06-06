const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    let filePath = "";
    let command = "";

    const path = require("path");

    const tempDir = path.join(process.cwd(), "temp");

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

    if (language === "python") {
     filePath = path.join(tempDir, "temp.py");
      fs.writeFileSync(filePath, code);
      command = `python "${filePath}"`;
    } else if (
      language === "javascript" ||
      language === "js"
    ) {
      filePath = path.join(tempDir, "temp.js");
      fs.writeFileSync(filePath, code);
      command = `node "${filePath}"`;
    } else {
      return res.status(400).json({
        output: "Language not supported",
      });
    }

    exec(command, (error, stdout, stderr) => {
      try {
        if (fs.existsSync(filePath)) {
         setTimeout(() => {
  try {
    fs.unlinkSync(filePath);
  } catch {}
}, 5000);
        }
      } catch {}

      if (error) {
        return res.json({
          output: stderr || error.message,
        });
      }

      res.json({
        output: stdout || stderr || "No Output",
      });
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      output: error.message,
    });
  }
};

module.exports = {
  runCode,
};