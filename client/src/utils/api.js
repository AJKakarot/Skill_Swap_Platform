// src/utils/api.js
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api", // your backend base URL
  withCredentials: true, // include cookies if using authentication
});

export default API;
