const admin = require('firebase-admin');
const serviceAccount = require('../../chitchat-key.json');

exports.initializeFirebaseAdmin = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
};

exports.db = admin.firestore;
