import axios from "axios";

const api = axios.create({
  baseURL: "https://task-manager-backend-production-e3a6.up.railway.app/api",
});

export default api;
