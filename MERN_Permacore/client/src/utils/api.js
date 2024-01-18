import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api'; // Update as per your server's URL


// Register a new user
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, userData);
    return response.data;
};

// Login a user
export const loginUser = async (userData) => {
    const response = await axios.post(`${API_BASE_URL}/users/login`, userData);
    return response.data;
};

// Get all users
export const getAllUsers = async () => {
    const response = await axios.get(`${API_BASE_URL}/users`);
    return response.data;
};

// Update a user's profile
export const updateUserProfile = async (userId, updateData) => {
    const response = await axios.put(`${API_BASE_URL}/users/${userId}`, updateData);
    return response.data;
};

// Reassign a user's role
export const reassignUserRole = async (userId, newRole) => {
    const response = await axios.put(`${API_BASE_URL}/users/reassignRole`, { userId, newRole });
    return response.data;
};

// Add other functions as needed for different routes
