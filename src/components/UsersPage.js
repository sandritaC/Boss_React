import React, {useState, useEffect} from 'react';
import './style.css';

function UsersPage() {
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {

        fetch('/get-users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error));


        fetch('/user', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setCurrentUser(data))
            .catch((error) => console.error('Error fetching current user:', error));


        fetch('/get-messages', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((response) => response.json())
            .then((data) => setMessages(data))
            .catch((error) => console.error('Error fetching messages:', error));
    }, []);

    const openModal = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setIsModalOpen(false);
        setErrorMessage('');
    };

    const handleWriteMessage = (recipientUsername) => {
        const user = users.find((user) => user.username === recipientUsername);
        if (user) {
            openModal(user);
        } else {
            setErrorMessage('User not found');
        }
    };

    const handleSendMessage = async () => {
        if (messageInput.trim().length < 3 || messageInput.trim().length > 100) {
            setErrorMessage('Message length should be between 3 and 100 characters');
            return;
        }

        if (messageInput.trim() === '') {
            setErrorMessage('Message cannot be empty');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const recipientUsername = selectedUser.username;

            const response = await fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    recipient: recipientUsername,
                    message: messageInput,
                }),
            });

            if (response.status === 200) {
                setMessageInput('');
                closeModal();
            } else {
                setErrorMessage('Error sending message: ' + response.statusText);
            }
        } catch (error) {
            setErrorMessage('Error sending message: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Registered Users</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {isModalOpen && (
                <div className="modal border d-flex ">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>
                            &times;
                        </span>
                        <h2>Write to {selectedUser.username}</h2>
                        <div className="d-flex j-center a-center">
                            <textarea
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                            />
                            <button className="m-10" onClick={handleSendMessage}>Send Message</button>
                        </div>

                    </div>
                </div>
            )}
            <div className="users">
                {users.map((user, index) => (<div key={index} className="d-flex">
                        <div className="d-flex j-center a-center col">
                            <div className="d-flex j-center a-center m-10">
                                <p className="flex-2"> {user.username}</p>
                                <img className="flex-2 m-10" src={user.image} alt={`Profile for ${user.username}`}/>
                            </div>
                            <div className="m-10">
                                {currentUser && currentUser.username !== user.username && (
                                    <button className="m-10" onClick={() => handleWriteMessage(user.username)}>
                                        Write Message
                                    </button>
                                )}
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UsersPage;
