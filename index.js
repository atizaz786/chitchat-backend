// index.js (Backend)
const express = require('express');
const app = express();
const http = require('http').Server(app);
const cors = require('cors');
const socketIO = require('socket.io')(http, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const PORT = 4000;
app.use(cors());
let users = [];

socketIO.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on('newUser', (data) => {
        users.push({ ...data, socketID: socket.id });
        socketIO.emit('newUserResponse', users);
    });

    socket.on('message', (data) => {
        const recipient = users.find(user => user.userId === data.recipientId);
        if (recipient) {
            socket.to(recipient.socketID).emit('messageResponse', data);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔥: A user disconnected');
        users = users.filter((user) => user.socketID !== socket.id);
        socketIO.emit('newUserResponse', users);
    });
});

app.get('/api', (req, res) => {
    res.json({ message: 'Hello world' });
});

http.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
