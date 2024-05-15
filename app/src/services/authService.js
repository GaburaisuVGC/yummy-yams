// src/services/authService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_REACT_APP_API_URL;

export const register = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, { username, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, { username, password });
    return response.data.token;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
