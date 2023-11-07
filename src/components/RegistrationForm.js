import React, { useState } from 'react';

function RegistrationForm({ onRegister }) {

    const [formData, setFormData] = useState({
        username: '',
        password1: '',
        password2: '',
    });
    const [error, setError] = useState('');
    const [hasError, setHasError] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setHasError(false);

        // Validation
        if (formData.username.length < 4) {
            setError('Username must be at least 4 characters long.');
            setHasError(true);

        } else if (formData.username.length > 20) {
            setError('Username cannot be longer than 20 characters.');
            setHasError(true);
        } else if (formData.password1.length < 4) {
            setError('Password must be at least 4 characters long.');
            setHasError(true);
        } else if (formData.password1.length > 20) {
            setError('Password cannot be longer than 20 characters.');
            setHasError(true);
        } else if (!/[A-Z]/.test(formData.password1)) {
            setError('Password must contain at least one uppercase letter.');
            setHasError(true);
        } else if (!/\d/.test(formData.password1)) {
            setError('Password must contain at least one number.');
            setHasError(true);
        } else if (formData.password1 !== formData.password2) {
            setError('Passwords do not match.');
            setHasError(true);
        } else {
            try {
                await onRegister(formData);
                console.log('Registration succeeded.');
                setError('');
                setHasError(false);
            } catch (error) {

                console.log('Entered catch block');
                console.error('Registration error:', error);
                if (error.response && error.response.data) {
                    console.log('Response Data:', error.response.data);
                }
                setError(error.response?.data?.error || 'An error occurred during registration.');
                console.log('Error message:', error.response?.data?.error || 'An error occurred during registration.');
                setHasError(true);
            }


        }

    };

    return (
        <div className="login-1">
            <h1>Welcome!</h1>
            <h2>Registration</h2>
            {hasError && <p>Error: {error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        name="password1"
                        value={formData.password1}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div>
                    <label>Confirm Password:</label>
                    <input
                        type="password"
                        name="password2"
                        value={formData.password2}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit">Register</button>
            </form>

        </div>
    );
}

export default RegistrationForm;
