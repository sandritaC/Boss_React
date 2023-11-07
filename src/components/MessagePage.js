import React, {useState, useEffect} from 'react';


function MessagePage() {

    const [messages, setMessages] = useState([]);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userProfilePhotos, setUserProfilePhotos] = useState({});
    const [loggedInUser, setLoggedInUser] = useState(null); // Add state to store the logged-in user
    const [selectedUserMessages, setSelectedUserMessages] = useState([]); // New state for selected user messages
    const [token, setToken] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        setToken(storedToken);


        fetch('/user', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setLoggedInUser(data.username);
            })
            .catch((error) => {
                console.error('Error fetching logged-in user:', error);
            });

        fetch('/get-messages', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${storedToken}`,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages(data);

                // Extract unique users from messages
                const uniqueUsers = [...new Set(data.map((message) => message.sender))];
                setUserList(uniqueUsers);


                fetch('/get-user-profile-photos')
                    .then((response) => response.json())
                    .then((profilePhotos) => {
                        setUserProfilePhotos(profilePhotos);
                    })
                    .catch((error) => {
                        console.error('Error fetching user profile photos:', error);
                    });
            })
            .catch((error) => {
                console.error('Error fetching messages:', error);
            });
    }, []);


    const handleUserClick = (user) => {
        setSelectedUser(user);

        fetch('/get-messages-between-users', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({recipient: user}),
        })
            .then((response) => response.json())
            .then((data) => {
                setSelectedUserMessages(data);
            })
            .catch((error) => {
                console.error('Error fetching messages between users:', error);
            });
    };

    const handleSendMessage = () => {
        if (!newMessage || newMessage.length < 3 || newMessage.length > 100) {
            const errorMessage = "Message length should be between 3 and 100 characters.";
            setErrorMessage(errorMessage);
            return;
        }

        const messageObject = {
            recipient: selectedUser,
            message: newMessage,
        };


        fetch('/send-message', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageObject),
        })
            .then((response) => response.json())
            .then(() => {
                // Clear the input field after sending the message
                setNewMessage('');
            })
            .catch((error) => {
                console.error('Error sending message:', error);
            });
        setErrorMessage('');
    };


    return (
        <div className="d-flex ">
            <div className="user-list ">
                <div>
                    {userList
                        .filter((user) => user !== loggedInUser)
                        .map((user) => (
                            <div className="d-flex j-center a-center" key={user} onClick={() => handleUserClick(user)}>
                                <div className="user-profile p-10">
                                    <img src={userProfilePhotos[user] || 'default-profile-image.jpg'}
                                         alt={`${user}'s Profile`}/>
                                </div>
                                <div className="p-10">
                                    {user}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div>
                <div className="message-display border p-10 chat scroll m-10">
                    {errorMessage && <p style={{color: 'red'}}>{errorMessage}</p>}
                    {selectedUser ? (
                        <div>
                            {selectedUserMessages.map((message, index) => (
                                <div
                                    key={index}
                                    className={message.sender === loggedInUser ? 'left' : 'right'}
                                >
                                    {message.sender === loggedInUser ? (
                                        <div className="speech-bubble p-10 m-10">
                                            <strong>You:</strong> {message.text}
                                        </div>
                                    ) : (
                                        <div className="speech-bubble-2 p-10 m-10">
                                            <strong>{message.sender}:</strong> {message.text}
                                        </div>
                                    )}
                                </div>
                            ))}


                        </div>
                    ) : (
                        <p>View messages.</p>
                    )}
                </div>
                <div className="send-message">
                    <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button onClick={handleSendMessage}>Send</button>
                </div>
            </div>

        </div>

    );
}

export default MessagePage;
