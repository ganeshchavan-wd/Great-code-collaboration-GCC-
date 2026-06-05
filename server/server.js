const codeRoutes = require("./routes/codeRoutes");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

const app = express();
const server = http.createServer(app);

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/code", codeRoutes);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-file", (fileId) => {
    socket.join(fileId);
    console.log("Joined file:", fileId);
  });

  socket.on("code-change", ({ fileId, content }) => {
    socket.to(fileId).emit("receive-code", content);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("GCC Backend Running 🚀");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 5001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});