import { io } from "socket.io-client";

const socket = io(
  "https://great-code-collaboration-gcc.onrender.com"
);

export default socket;