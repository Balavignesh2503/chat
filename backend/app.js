// server.js
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

// Middleware
app.use(cors());
app.use(express.json());

// Temporary In-Memory Data
let messages = []; // Store chat messages
let users = {}; // Map socket IDs to usernames

// WebSocket Handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user joining
    socket.on('join', (username) => {
        users[socket.id] = username;
        io.emit('userJoined', `${username} joined the chat`);
    });

    // Handle incoming messages
    socket.on('sendMessage', (message) => {
        const username = users[socket.id];
        const fullMessage = { username, message, timestamp: new Date() };
        messages.push(fullMessage); // Store in memory
        io.emit('receiveMessage', fullMessage); // Broadcast to all users
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        const username = users[socket.id];
        delete users[socket.id];
        io.emit('userLeft', `${username} left the chat`);
    });
});

// Start the Server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
