const userService = require('../services/userService');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected!`);

        socket.on('newUser', (data) => userService.handleNewUser(socket, data, io));
        socket.on('message', (data) => userService.handleMessage(socket, data, io));
        socket.on('disconnect', () => userService.handleDisconnect(socket, io));
    });
};
