import axios from "axios";

const ax = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
  });


  // Better Auth Component - Replace with your auth client logic
  const token = localStorage.getItem("token");

  if (token) {
    api.interceptors.request.use(async (request) => {
      api.defaults.baseURL = import.meta.env.VITE_API_URL as string;
      request.headers.Authorization = `Bearer ${token}`;
      axios.defaults.headers.Authorization = `Bearer ${token}`;
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      return request;
    });
  }

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return api;
};

export default ax;
