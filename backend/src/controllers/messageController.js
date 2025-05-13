const whatsappService = require('../services/whatsappService');

const sendMessage = async (req, res, next) => {
    const { phoneNumber, message } = req.body;

    // Validate input
    if (!phoneNumber || !message) {
        return res.status(400).json({ error: 'phoneNumber and message are required' });
    }

    try {
        const result = await whatsappService.sendMessage(phoneNumber, message);
        res.json(result);
    } catch (err) {
        next(err); // Pass to error middleware
    }
};

module.exports = {
    sendMessage,
};