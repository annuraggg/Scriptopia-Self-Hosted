import axios from "axios";
import { authClient } from "../lib/auth-client";

const ax = () => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL as string,
  });

  authClient.getSession().then((session) => {
    const token = session?.data?.session?.token || null;
    if (token) {
      api.interceptors.request.use(async (request) => {
        api.defaults.baseURL = import.meta.env.VITE_API_URL as string;
        axios.defaults.withCredentials = true;
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
  });

  return api;
};

export default ax;
