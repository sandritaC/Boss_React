import React, {useState, useEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAngleUp, faAngleDown} from '@fortawesome/free-solid-svg-icons';

function PostsPage() {

    const [posts, setPosts] = useState([]);
    const [showCreatePostModal, setShowCreatePostModal] = useState(false);
    const [newPost, setNewPost] = useState({
        title: '',
        image: '',
    });
    const [selectedPost, setSelectedPost] = useState(null); // State to store the selected post
    const [commentInput, setCommentInput] = useState(''); // State for comment input
    const [sortOrder, setSortOrder] = useState('asc'); // Default sorting order is ascending
    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [messageInput, setMessageInput] = useState('');
    const [selectedRecipient, setSelectedRecipient] = useState(null);
    const [showMessageInput, setShowMessageInput] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(''); // Set the logged-in user
    const [messageError, setMessageError] = useState('');
    const [sortOrderIcons, setSortOrderIcons] = useState({
        likes: null,
        comments: null,
        time: null,
    });


    const updatePostState = (updatedPost) => {
        setPosts((prevPosts) => {
            return prevPosts.map((post) => {
                if (post._id === updatedPost._id) {
                    return updatedPost;
                }
                return post;
            });
        });
    };
    const fetchPostById = async (postId) => {
        const response = await fetch(`/get-post/${postId}`);
        if (response.status === 200) {
            const updatedPost = await response.json();
            updatePostState(updatedPost);
        }
    };

    const toggleCreatePostModal = () => {
        setShowCreatePostModal(!showCreatePostModal);
    };

    const openPostModal = async (post) => {
        setSelectedPost(post);
        const token = localStorage.getItem('token');
        const response = await fetch(`/user-image/${post.username}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.status === 200) {
            const userData = await response.json();
            setSelectedPost({...post, userImage: userData.image});
        }
    };

    const closePostModal = () => {
        setSelectedPost(null);
    };
    const openMessageModal = (recipient) => {
        setSelectedRecipient(recipient);
        setMessageModalOpen(true);
    };

    const closeMessageModal = () => {
        setSelectedRecipient(null);
        setMessageModalOpen(false);
    };

    const handleCommentChange = (event) => {
        setCommentInput(event.target.value);
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setNewPost({
            ...newPost,
            [name]: value,
        });
    };

    const createNewPost = async () => {

        const token = localStorage.getItem('token');

        const response = await fetch('/create-post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(newPost),
        });

        if (response.status === 200) {
            const createdPost = await response.json();
            setPosts([createdPost, ...posts]);
            toggleCreatePostModal();
        }
    };

    const addComment = async () => {
        if (selectedPost) {

            const token = localStorage.getItem('token');


            const response = await fetch('/add-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({postId: selectedPost._id, text: commentInput}),
            });

            if (response.status === 200) {

                const updatedPost = await response.json();


                updatedPost.userImage = selectedPost.userImage;
                updatePostState(updatedPost);
                setSelectedPost(updatedPost);
                setCommentInput('');
            }

        }
    };

    const likePost = async () => {
        if (selectedPost) {

            const token = localStorage.getItem('token');


            const response = await fetch('/like-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({postId: selectedPost._id}),
            });

            if (response.status === 200) {

                const updatedPost = await response.json();
                updatedPost.userImage = selectedPost.userImage;
                updatePostState(updatedPost);
                setSelectedPost(updatedPost);
            }

        }
    };

    const unlikePost = async () => {
        if (selectedPost) {
            const token = localStorage.getItem('token');
            const response = await fetch('/unlike-post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ postId: selectedPost._id }),
            });

            if (response.status === 200) {
                const updatedPost = await response.json();
                updatedPost.userImage = selectedPost.userImage;
                updatePostState(updatedPost);
                setSelectedPost(updatedPost);
            }
        }
    };




    useEffect(() => {

        const fetchPosts = async () => {
            const response = await fetch('/get-posts');
            if (response.status === 200) {
                const fetchedPosts = await response.json();
                setPosts(fetchedPosts);
            }
        };


        fetchPosts();
    }, []);
    const handleSortByLikes = () => {
        const sortedPosts = [...posts];
        let newOrder = sortOrderIcons.likes === 'asc' ? 'desc' : 'asc';

        if (newOrder === 'asc') {
            sortedPosts.sort((a, b) => a.likes - b.likes);
            setSortOrderIcons({likes: 'asc', comments: null, time: null});
        } else {
            sortedPosts.sort((a, b) => b.likes - a.likes);
            setSortOrderIcons({likes: 'desc', comments: null, time: null});
        }

        setPosts(sortedPosts);
    };
    const handleSortByComments = () => {
        const sortedPosts = [...posts];
        let newOrder = sortOrderIcons.comments === 'asc' ? 'desc' : 'asc';

        if (newOrder === 'asc') {
            sortedPosts.sort((a, b) => a.comments.length - b.comments.length);
            setSortOrderIcons({likes: null, comments: 'asc', time: null});
        } else {
            sortedPosts.sort((a, b) => b.comments.length - a.comments.length);
            setSortOrderIcons({likes: null, comments: 'desc', time: null});
        }

        setPosts(sortedPosts);
    };
    const handleSortByTime = () => {
        const sortedPosts = [...posts];
        let newOrder = sortOrderIcons.time === 'asc' ? 'desc' : 'asc';

        if (newOrder === 'asc') {
            sortedPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setSortOrderIcons({likes: null, comments: null, time: 'asc'});
        } else {
            sortedPosts.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            setSortOrderIcons({likes: null, comments: null, time: 'desc'});
        }

        setPosts(sortedPosts);
    };
    const sendMessage = async (recipientUsername, messageText) => {
        if (!messageText || messageText.trim() === '') {

            console.error('Message text is empty or undefined');
            return;
        }
        if (messageText.length < 3 || messageText.length > 100) {
            setMessageError('Message should be between 3 and 100 characters');
            return;
        }
        try {
            const token = localStorage.getItem('token');


            const response = await fetch('/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    recipient: recipientUsername,
                    message: messageText,
                }),
            });

            if (response.status === 200) {

                console.log('Message sent successfully');
                setMessageInput('');
                setShowMessageInput(false);
            } else {
                console.error('Error sending message:', response.statusText);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            setMessageError('Failed to send the message');
        }
    };
    const handleMessageInputChange = (event) => {
        setMessageInput(event.target.value);
    };
    const toggleMessageInput = () => {
        setShowMessageInput(!showMessageInput);
    };

    useEffect(() => {

        const fetchLoggedInUser = async () => {
            try {

                const response = await fetch('/user', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });

                if (response.status === 200) {
                    const userData = await response.json();
                    setLoggedInUser(userData.username);
                }
            } catch (error) {
                console.error('Error fetching logged-in user:', error);
            }
        };


        const fetchPosts = async () => {

        };

        fetchLoggedInUser();
        fetchPosts();
    }, []);
    const formatDateTime = (dateTime) => {
        const options = {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateTime).toLocaleDateString('en-US', options);
    };

    return (
        <div>
            <div className="p-10">
                <button onClick={toggleCreatePostModal}>Create Post</button>

                <button onClick={handleSortByLikes}>
                    Sort by Likes{' '}
                    {sortOrderIcons.likes === 'asc' ? (
                        <FontAwesomeIcon icon={faAngleUp}/>
                    ) : (
                        <FontAwesomeIcon icon={faAngleDown}/>
                    )}
                </button>

                <button onClick={handleSortByComments}>
                    Sort by Comments{' '}
                    {sortOrderIcons.comments === 'asc' ? (
                        <FontAwesomeIcon icon={faAngleUp}/>
                    ) : (
                        <FontAwesomeIcon icon={faAngleDown}/>
                    )}
                </button>

                <button onClick={handleSortByTime}>
                    Sort by Time{' '}
                    {sortOrderIcons.time === 'asc' ? (
                        <FontAwesomeIcon icon={faAngleUp}/>
                    ) : (
                        <FontAwesomeIcon icon={faAngleDown}/>
                    )}
                </button>
            </div>
            {showCreatePostModal && (
                <div className="create-post-modal">
                    <h2>Create a New Post</h2>
                    <input
                        type="text"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={newPost.image}
                        onChange={(e) => setNewPost({...newPost, image: e.target.value})}
                    />
                    <button onClick={createNewPost}>Create Post</button>
                    <button onClick={toggleCreatePostModal}>Cancel</button>
                </div>
            )}

            {selectedPost && (
                <div className="post-modal">
                    <div className="d-flex border bg">
                        <div className="flex-2 border bg post-img">
                            <img src={selectedPost.image} alt={selectedPost.title}/>
                        </div>
                        <div className="flex-2">
                            <div className="d-flex flex-2 post-img-2 bg border j-center a-center">
                                <p className="m-10">{selectedPost.username}</p>
                                {selectedPost.userImage &&
                                    <img className="m-10" src={selectedPost.userImage} alt="User"/>}


                            </div>


                            <div>
                                <h2>{selectedPost.title}</h2>
                                <p>Likes: {selectedPost.likes}</p>
                                <button onClick={likePost} disabled={selectedPost.username === loggedInUser}>
                                    Like
                                </button>
                                <button onClick={unlikePost} disabled={selectedPost.username === loggedInUser}>
                                   Unlike
                                </button>
                            </div>
                        </div>

                    </div>

                    <div className="border bg">
                        {showMessageInput && (
                            <div className="message-input-section border">
                                <input
                                    type="text"
                                    placeholder="Write a message"
                                    value={messageInput}
                                    onChange={handleMessageInputChange}
                                />
                                <button onClick={() => sendMessage(selectedPost.username, messageInput)}>
                                    Send Message
                                </button>
                                <button onClick={toggleMessageInput}>Close</button>
                                {messageError && <p style={{color: 'red'}}>{messageError}</p>}
                            </div>
                        )}
                        <button className="m-10" onClick={toggleMessageInput}
                                disabled={selectedPost.username === loggedInUser}>
                            {showMessageInput ? 'Close Message Input' : 'Write a Message'}
                        </button>
                    </div>


                    <div className="comment-section border bg">
                        {selectedPost.comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p>{comment.username}: {comment.text}</p>
                            </div>
                        ))}
                        <input
                            type="text"
                            placeholder="Add a comment"
                            value={commentInput}
                            onChange={handleCommentChange}
                            disabled={selectedPost.username === loggedInUser}
                        />
                        <button onClick={addComment} disabled={selectedPost.username === loggedInUser}>
                            Add Comment
                        </button>
                    </div>

                    <button onClick={closePostModal}>Close</button>
                </div>
            )}
            <div>
                <div className="posts-container d-flex j-center a-center ">
                    {posts.map((post) => (
                        <div key={post._id} className="border post m-10 ">
                            <h2>{post.title}</h2>

                            <p>Username: {post.username}</p>
                            <img src={post.image} alt={post.title}/>


                            <p>Likes: {post.likes}</p>
                            <p>Comments: {post.comments.length}</p>
                            <p>Time: {formatDateTime(post.createdAt)}</p>
                            <button onClick={() => openPostModal(post)}>View Post</button>


                        </div>
                    ))}

                </div>
            </div>


        </div>
    );
}

export default PostsPage;
