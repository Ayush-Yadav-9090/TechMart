import api from "./api"; //  SAME INSTANCE
login: (data) => api.post("/auth/login/", data)
