import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Connect to the backend

const App = () => {
    const [username, setUsername] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        socket.on('receiveMessage', (msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        socket.on('userJoined', (msg) => {
            setMessages((prev) => [...prev, { username: 'System', message: msg }]);
        });

        socket.on('userLeft', (msg) => {
            setMessages((prev) => [...prev, { username: 'System', message: msg }]);
        });
    }, []);

    const joinChat = () => {
        socket.emit('join', username);
    };

    const sendMessage = () => {
        socket.emit('sendMessage', message);
        setMessage('');
    };

    return (
        <div>
            {!username ? (
                <div>
                    <input
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={joinChat}>Join Chat</button>
                </div>
            ) : (
                <div>
                    <div>
                        {messages.map((msg, index) => (
                            <p key={index}>
                                <strong>{msg.username}: </strong>
                                {msg.message}
                            </p>
                        ))}
                    </div>
                    <input
                        type="text"
                        placeholder="Type a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button onClick={sendMessage}>Send</button>
                </div>
            )}
        </div>
    );
};

export default App;
