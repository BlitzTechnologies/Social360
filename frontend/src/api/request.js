import axios from "axios";


console.log(process.env.REACT_APP_API_END_POINT)

const request = axios.create({
  baseURL: process.env.REACT_APP_API_END_POINT,
  headers: {
    "Content-Type": "application/json",
  },
});

request.interceptors.request.use(function (config) {
  const token = localStorage.getItem("accessToken");
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

request.interceptors.response.use(
  function (response) {
    if (response.data?.status === "Fail") {
      return Promise.reject(response.data.message);
    }
    return response.data;
  },
  function (error) {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default request;
