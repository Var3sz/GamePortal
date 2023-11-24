import axios from 'axios';

const API_URL = 'http://localhost:5086';
export const REGISTER_URL = "/api/auth/registration";
export const LOGIN_URL = "/api/auth/login";

export const axiosPrivate = axios.create({
    baseURL: API_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

export default axios.create({
    baseURL: API_URL
});
