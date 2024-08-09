class Room {
    uuid;
    code;
    host;
    participants;
    createdBy;
    settings; 
}

class Settings {
    roomSize;
    visibility;
}

class RoomLog {
    uuid;
    code;
    host;
    participants;
    createdBy;
    settings; 
}

module.exports = {
    Room, 
    Settings,
    RoomLog
}