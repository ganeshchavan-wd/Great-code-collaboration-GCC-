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
    methods: ["GET", "POST", "PUT"],
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/code", codeRoutes);

/* ======================
   Socket.IO
====================== */

io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);

  socket.on("join-file", (fileId) => {
    socket.join(fileId);
    console.log(`Joined Room: ${fileId}`);
  });

  socket.on("code-change", (data) => {
    socket.to(data.fileId).emit(
      "receive-code",
      data.content
    );
  });

  socket.on("disconnect", () => {
    console.log(
      "User Disconnected:",
      socket.id
    );
  });
});

/* ======================
   Routes
====================== */

app.get("/", (req, res) => {
  res.send("GCC Backend Running 🚀");
});

/* ======================
   MongoDB
====================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    console.log("MongoDB Connected")
  )
  .catch((err) =>
    console.log("MongoDB Error:", err)
  );

/* ======================
   Server
====================== */

const PORT = process.env.PORT || 5001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(
    `Server running on port ${PORT}`
  );
});