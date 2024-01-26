const firebaseAdmin = require('../config/firebaseAdmin');

exports.getMessages = async (senderId, recipientId) => {
    const db = firebaseAdmin.db();
    try {
        const conversationId = [senderId, recipientId].sort().join('_');
        const conversationRef = db.collection('conversations').doc(conversationId);
        const doc = await conversationRef.get();

        if (doc.exists) {
            return doc.data().messages;
        } else {
            return []; // Conversation does not exist
        }
    } catch (error) {
        console.error('Error retrieving messages:', error);
        return [];
    }
};

exports.storeMessage = async (message) => {
    const db = firebaseAdmin.db();
    try {
        const { senderId, recipientId, text } = message;
        const messageId = `${senderId}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

        // Retrieve recipient's username or display name
        const recipientRef = db.collection('users').doc(recipientId);
        const recipientDoc = await recipientRef.get();
        const recipientName = recipientDoc.exists && recipientDoc.data().displayName 
                              ? recipientDoc.data().displayName || recipientDoc.data().username
                              : 'Unknown User';

        const conversationId = [senderId, recipientId].sort().join('_');
        const conversationRef = db.collection('conversations').doc(conversationId);

        // Manually generate a timestamp
        const timestamp = firebaseAdmin.db.Timestamp.now();

        await conversationRef.set({
            messages: firebaseAdmin.db.FieldValue.arrayUnion({
                messageId,
                senderId,
                recipientId,
                recipientName,
                text,
                timestamp,
            }),
        }, { merge: true });
    } catch (error) {
        console.error('Error storing message:', error);
    }
};
