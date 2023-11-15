// api.js
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Create an instance of axios
const apiInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    // Add other custom settings as needed
});

// Set up a request interceptor to include the auth token in every request
apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken'); // Adjust based on where you store your token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// A generic error handler
const handleError = (error) => {
    console.error('API Error:', error.response || error);
    throw error.response.data || error.message;
};

// Function to handle GET requests
export const get = async (url) => {
    try {
        const response = await apiInstance.get(url);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Function to handle POST requests
export const post = async (url, data) => {
    try {
        const response = await apiInstance.post(url, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Function to handle PUT requests
export const put = async (url, data) => {
    try {
        const response = await apiInstance.put(url, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

// Function to handle DELETE requests
export const del = async (url) => {
    try {
        const response = await apiInstance.delete(url);
        return response.data;
    } catch (error) {
        handleError(error);
    }
};

export default apiInstance;
