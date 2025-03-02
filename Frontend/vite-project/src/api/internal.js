{
  /*import axios from "axios";
import.meta.env.VITE_INTERNAL_API_PATH;

const api = axios.create({
  baseURL: process.env.VITE_INTERNAL_API_PATH,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => {
  let response;
  try {
    response = await api.post("/login", data);
  } catch (error) {
    return error;
  }
  return response;
};
*/
}

import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_INTERNAL_API_PATH, // ✅ Correct way for Vite
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const login = async (data) => {
  try {
    const response = await api.post("/login", data);
    return response;
  } catch (error) {
    return error;
  }
};

export const signup = async (data) => {
  try {
    const response = await api.post("/register", data);
    return response;
  } catch (error) {
    return error;
  }
};

export const signout = async () => {
  try {
    const response = await api.post("/logout");
    return response;
  } catch (error) {
    return error;
  }
};
