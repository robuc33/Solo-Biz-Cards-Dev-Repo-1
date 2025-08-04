import { api } from "../utils/api";

const authApi = {
  register: (data) => api.post("/user/signup", data),
  login: (data) => api.post("/user/login", data),
  logout: () => api.post("/user/logout"),
  getAuthStatus: () => api.get("/user/auth-status"),
  refreshToken: () => api.post("/user/refresh-token"),
};

export { authApi };
