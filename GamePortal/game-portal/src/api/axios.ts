import axios from 'axios';

const API_URL = 'http://localhost:5086';

export default axios.create({
    baseURL: API_URL
});

export const axiosPrivate = axios.create({
    baseURL: API_URL,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});