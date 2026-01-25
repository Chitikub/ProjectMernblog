import axios from "axios";
import TokenService from "./token.service";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://projectmernblogbackend.onrender.com/api/v1",
});

instance.interceptors.request.use(
  (config) => {
    const token = TokenService.getAccessToken();
    if (token) {
      config.headers["x-access-token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;