import api from "./api";
import TokenService from "./token.service";

const API_URL = import.meta.env.VITE_AUTH_URL || "/user";

const register = async (username, password) => {
  return await api.post(API_URL + "/register", { username, password });
};

const login = async (username, password) => {
  const response = await api.post(API_URL + "/login", { username, password });
  if (response.status === 200 && response.data?.accessToken) {
    TokenService.setUser(response.data);
  }
  return response;
};

const logout = () => {
  TokenService.removeUser();
};

const AuthService = {
  register,
  login,
  logout,
};

export default AuthService;
