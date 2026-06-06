const axios = require("axios");

const runCode = async (req, res) => {
  try {
    const { language, code } = req.body;

    const response = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language,
        version: "*",
        files: [
          {
            content: code,
          },
        ],
      }
    );

    res.json({
      output:
        response.data.run?.output ||
        response.data.run?.stderr ||
        "No Output",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  runCode,
};