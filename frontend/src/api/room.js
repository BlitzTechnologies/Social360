import request from "./request";

export const createRoom = ({ code, host, participants, createdBy, settings }) => {
    return request.post("/rooms/", { code, host, participants, createdBy, settings})
}