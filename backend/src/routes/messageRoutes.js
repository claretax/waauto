const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// POST /send-message
router.post('/send-message', messageController.sendMessage);

module.exports = router;