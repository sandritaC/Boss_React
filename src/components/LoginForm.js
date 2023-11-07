import React, { useState } from 'react';
import axios from "axios";
import './style.css'

function LoginForm({ onLogin }) {

    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [errors, setErrors] = useState({});
    const [autoLogin, setAutoLogin] = useState(false); // New state for auto-login

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const toggleAutoLogin = () => {
        setAutoLogin(!autoLogin);
    };
    const validateForm = () => {
        const errors = {};

        if (formData.username.length < 4 || formData.username.length > 20) {
            errors.username = 'Username must be between 4 and 20 characters';
        }

        if (formData.password.length < 4 || formData.password.length > 20) {
            errors.password = 'Password must be between 4 and 20 characters';
        }

        if (!/^(?=.*[A-Z])/.test(formData.password)) {
            errors.password = 'Password must contain at least one uppercase letter';
        }

        if (!/^(?=.*\d)/.test(formData.password)) {
            errors.password = 'Password must contain at least one number';
        }

        setErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            const loginData = {
                username: formData.username,
                password: formData.password,
            };

            try {
                const loggedInUser = await onLogin(loginData);
                setIsLoggedIn(true);
            } catch (error) {
                console.error('Login error:', error);
            }
        }
    };

    return (
        <div className="login-1 ">
            <h1>Welcome back!</h1>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="autoLogin"
                        name="autoLogin"
                        checked={autoLogin}
                        onChange={toggleAutoLogin}
                    />
                    <label htmlFor="autoLogin">Stay logged in</label>
                </div>
                <button type="submit">Login</button>
            </form>

        </div>
    );
}

export default LoginForm;
