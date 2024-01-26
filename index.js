const express = require('express');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');
const appConfig = require('./src/config/firebaseAdmin');
const apiRoutes = require('./src/routes/apiRoutes');
const socketManager = require('./src/utils/socketManager');

const app = express();
const server = http.Server(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000"
    }
});

appConfig.initializeFirebaseAdmin(); // Initialize Firebase Admin
app.use(cors());
app.use('/api', apiRoutes); // API routes

socketManager(io); // Manage socket connections

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});
