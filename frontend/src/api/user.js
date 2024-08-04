import request from "./request";


export const register = ({ fullName, email, username, password }) => {
  return request.post("/users/", { fullName, email, username, password });
};

