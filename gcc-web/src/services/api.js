import axios from "axios";

const API = axios.create({
 baseURL:
"https://gcc-backend.onrender.com"
});

export default API;