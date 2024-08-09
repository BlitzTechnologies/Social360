const yup = require('yup');

const validateCreateRoom = yup.object().shape({
  createdBy: yup.object().shape({
    username: yup.string().required('username is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    id: yup.string().required("id is required")
  }).required('createdBy is required'),
  settings: yup.object().shape({
    roomSize: yup.number().required('RoomSize is required'),
    visibility: yup.number().required('Visibility is required')
  }).required('Settings is required')
});

const generateRoomCode = () => {
    const min = 1000000;
    const max = 9999999;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
    validateCreateRoom,
    generateRoomCode
}