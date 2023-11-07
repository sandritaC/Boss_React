// Auth.js
import axios from 'axios';

const API_URL = 'http://localhost:3000';

class Auth {
    register = async (userData) => {

        try {
            const response = await axios.post(`${API_URL}/register`, userData);
            return response.data;

        } catch (error) {
            console.error('Registration error:', error.response);
            throw error;
        }


    };

    login = async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/login`, userData);
            return response.data.token;
        } catch (error) {
            throw error;
        }
    };

    setToken = (token) => {
        localStorage.setItem('token', token);
    };

    getToken = () => {
        return localStorage.getItem('token');
    };

    logout = () => {
        localStorage.removeItem('token');
    };

    isLoggedIn = () => {
        const token = this.getToken();
        return !!token;
    };


}

export default new Auth();
