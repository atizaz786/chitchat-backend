const conversationService = require('./conversationService');
let users = [];

exports.handleNewUser = (socket, data, io) => {
    const existingUser = users.find(user => user.userId === data.userId);
    if (!existingUser) {
        users.push({ ...data, socketID: socket.id });
        console.log('User added:', data);
    } else {
        existingUser.socketID = socket.id;
    }
    io.emit('newUserResponse', users);
};

exports.handleMessage = async (socket, data, io) => {
    const recipient = users.find(user => user.userId === data.recipientId);
    if (recipient) {
        socket.to(recipient.socketID).emit('messageResponse', data);
    }
    await conversationService.storeMessage(data);
};

exports.handleDisconnect = (socket, io) => {
    console.log('🔥: A user disconnected', socket.id);
    users = users.filter((user) => user.socketID !== socket.id);
    console.log('Updated users:', users);
};
