class Room {
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