import axios from "axios";

const API = axios.create({
 baseURL:
  "https://great-code-collaboration-gcc.onrender.com/api",
});

export default API;