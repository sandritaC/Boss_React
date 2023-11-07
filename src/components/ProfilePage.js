import React, {useState, useEffect} from 'react';
import axios from 'axios';


function ProfilePage() {
    const [image, setImage] = useState('');
    const [newImage, setNewImage] = useState('');
    const [username, setUsername] = useState('');
    const [newUsername, setNewUsername] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [changePasswordVisible, setChangePasswordVisible] = useState(false);
    const [existingPassword, setExistingPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [passwordChangeError, setPasswordChangeError] = useState('');
    const [userData, setUserData] = useState({});

    const handleImageChange = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/change-image',
                {
                    image: newImage,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {

                setImage(newImage);
                setNewImage('');

                alert('Image changed successfully');
            } else {
                alert('Image change failed. Please try again.');
            }
        } catch (error) {
            console.error('Image change error:', error);
            alert('Image change failed. Please try again.');
        }
    };

    const handlePasswordChange = async () => {
        try {
            if (newPassword !== confirmNewPassword) {
                setPasswordChangeError("New password and confirmation don't match.");
                return;
            }

            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }

            const response = await axios.post(
                'http://localhost:3000/change-password',
                {
                    username: userData.username,
                    oldPassword: existingPassword,
                    newPassword,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                alert(response.data.message);
                setNewPassword('');
                setConfirmNewPassword('');
                setPasswordChangeError('');
            } else {
                setPasswordChangeError('Password change failed. Please try again.');
            }
        } catch (error) {
            console.error('Password change error:', error);
            setPasswordChangeError('Password change failed. Please try again.');
        }
    };
    const toggleChangePassword = () => {
        setChangePasswordVisible(!changePasswordVisible);

    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            axios
                .get('http://localhost:3000/user', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    if (response.status === 200) {
                        setUserData(response.data);
                        setImage(response.data.image);

                    }
                })
                .catch((error) => {
                    console.error('User data fetch error:', error);
                });
        }
    }, []);


    return (
        <div>
            <p>HI, {userData.username}!</p>
            <div>
                <img src={image} alt="User Profile"/>
                <button onClick={handleImageChange}>Change Image</button>
                <input
                    type="text"
                    placeholder="New Image URL"
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                />
            </div>
            <div>
                <h3>Password Change</h3>
                <button onClick={toggleChangePassword}>
                    {changePasswordVisible ? 'Hide Change Password' : 'Change Password'}
                </button>
                {changePasswordVisible && (
                    <div>
                        <input
                            type="password"
                            placeholder="Old Password"
                            value={existingPassword}
                            onChange={(e) => setExistingPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <button onClick={handlePasswordChange}>Change Password</button>
                        {passwordChangeError && <p>{passwordChangeError}</p>}
                    </div>
                )}
            </div>

        </div>
    );
}

export default ProfilePage;