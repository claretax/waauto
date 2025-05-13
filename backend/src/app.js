const express = require('express');
const messageRoutes = require('./routes/messageRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/v1', messageRoutes);
app.use('/api/notifications', require('./routes/notificationRoutes'));

// Error handling
app.use(errorMiddleware);

module.exports = app;