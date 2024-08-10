import request from "./request";

export const createRoom = ({ createdBy, settings }) => {
    return request.post("/rooms/", { createdBy, settings})
}

export const getRoom = () => {
    return request.get('/rooms/')
}