const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

class WhatsAppService {
    constructor() {
        this.client = new Client({
            authStrategy: new LocalAuth(),
        });

        this.client.on('qr', (qr) => {
            console.log('⚡⚡ ACTION REQUIRED ⚡⚡');
            console.log('Scan the QR code below:');
            qrcode.generate(qr, { small: true });
        });

        this.client.on('ready', () => {
            console.log('✅ WhatsApp bot is ready!');
        });

        this.client.on('disconnected', (reason) => {
            console.log('Bot disconnected:', reason);
        });
    }

    async initialize() {
        try {
            await this.client.initialize();
        } catch (err) {
            console.error('Failed to initialize WhatsApp client:', err);
            throw err;
        }
    }

    async sendMessage(phoneNumber, message) {
        try {
            const formattedNumber = phoneNumber.includes('@c.us') ? phoneNumber : `${phoneNumber}@c.us`;
            await this.client.sendMessage(formattedNumber, message);
            return { success: true, message: 'Message sent successfully' };
        } catch (err) {
            throw new Error(`Failed to send message: ${err.message}`);
        }
    }
}

module.exports = new WhatsAppService();