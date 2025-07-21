import axios from "axios";

const ax = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
    withCredentials: true,
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        console.log("Unauthorized request");
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default ax;
