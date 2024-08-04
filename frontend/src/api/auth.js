import request from "./request";

export const login = ({ usernameEmail, password }) => {
  return request.post("/auth/login", { usernameEmail, password });
};

