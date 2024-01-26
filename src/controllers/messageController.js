const conversationService = require('../services/conversationService');

exports.fetchMessages = async (req, res) => {
    const { senderId, recipientId } = req.query;

    if (!senderId || !recipientId) {
        return res.status(400).send('Sender and recipient IDs are required');
    }

    try {
        const messages = await conversationService.getMessages(senderId, recipientId);
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).send('Error fetching messages');
    }
};
