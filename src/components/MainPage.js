import React, {useState} from 'react';

import ProfilePage from './ProfilePage';
import MessagesPage from './MessagePage';
import PostsPage from './PostsPage';
import UsersPage from './UsersPage';


function MainPage() {
    const [activeSection, setActiveSection] = useState('profile');

    const handleSectionClick = (section) => {
        setActiveSection(section);
    };


    return (
        <div>
            <div>
                <div className="main login login-2 d-flex j-center a-center">
                    <button onClick={() => handleSectionClick('profile')}>Profile</button>
                    <button onClick={() => handleSectionClick('messages')}>Messages</button>
                    <button onClick={() => handleSectionClick('posts')}>Posts</button>
                    <button onClick={() => handleSectionClick('users')}>Users</button>
                </div>
            </div>
            <div>
                {activeSection === 'profile' && <ProfilePage/>}
                {activeSection === 'messages' && <MessagesPage/>}
                {activeSection === 'posts' && <PostsPage/>}
                {activeSection === 'users' && <UsersPage/>}
            </div>
        </div>
    );
}

export default MainPage;

