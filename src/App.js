import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';
import './App.css';
import './components/style.css'
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import Auth from './Auth';
import MainPage from './components/MainPage';

function App() {
    const [showLogin, setShowLogin] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const token = localStorage.getItem('token');

            if (token) {
                try {
                    const response = await fetch('/user', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };

        checkLoginStatus();
    }, []);

    const handleRegister = async (userData) => {
        try {
            await Auth.register(userData);
            alert('Registration successful');
        } catch (error) {
            console.error(error);
            alert('Registration failed');
        }
    };

    const handleLogin = async (userData) => {
        try {
            const token = await Auth.login(userData);
            Auth.setToken(token);
            setIsLoggedIn(true);
            alert('Login successful');
        } catch (error) {
            console.error(error);
            alert('Login failed');
        }

    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
    }

    const handleToggleForm = () => {
        setShowLogin(!showLogin);
    };

    return (
        <Router>

            <div className="App login-2 d-flex j-center a-center col">
                <div className="d-flex col  ">
                    <h1>FakeBook</h1>
                    <p>uuuu</p>
                    <Switch>
                        {isLoggedIn ? (
                            <div className=" d-flex j-center ">
                                <div>
                                    <MainPage/>
                                </div>
                                <div >
                                    <button className="log-out" onClick={handleLogout}>Logout</button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                {showLogin ? (
                                    <div>
                                        <LoginForm onLogin={handleLogin}/>
                                        <p>
                                            Don't have an account?{' '}
                                            <button onClick={handleToggleForm}>Register</button>
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <RegistrationForm onRegister={handleRegister}/>
                                        <p>
                                            Already have an account?{' '}

                                            <button onClick={handleToggleForm}>Login</button>
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </Switch>
                </div>

            </div>
        </Router>
    );
}

export default App;
