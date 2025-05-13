require('dotenv').config();
const app = require('./src/app');
const whatsappService = require('./src/services/whatsappService');
const config = require('./config/config');

const startServer = async () => {
    try {
        await whatsappService.initialize();
        app.listen(config.port, () => {
            console.log('🛜 HTTP Server ON');
            console.log(`[POST]: http://localhost:${config.port}/api/v1/send-message`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
};

startServer();