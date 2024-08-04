import request from "./request";

export const register = ({ fullName, email, username, password }) => {
    return request.post("/users/", { fullName, email, username, password });
};

export const checkEmail = ({ email }) => {
    return request.post("/users/check/email", { email });
};

export const checkUsername = ({ username }) => {
    return request.post("/users/check/username", { username });
};
