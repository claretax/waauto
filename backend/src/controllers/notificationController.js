const { default: axios } = require('axios');
const whatsappService = require('../services/whatsappService');

function parseFrequency(frequency) {
    // Supports '1d', '2h', '30m', '3days', '2w', '2weeks', '1m', '1month', etc.
    if (!frequency) return null;
    const freq = frequency.trim().toLowerCase();
    const match = freq.match(/(\d+)\s*(d|day|days|h|hour|hours|m|min|minute|minutes|w|week|weeks|mo|month|months)/);
    if (!match) return null;
    const value = parseInt(match[1], 10);
    const unit = match[2];
    if (["d", "day", "days"].includes(unit)) return value * 24 * 60 * 60 * 1000;
    if (["h", "hour", "hours"].includes(unit)) return value * 60 * 60 * 1000;
    if (["m", "min", "minute", "minutes"].includes(unit)) return value * 60 * 1000;
    if (["w", "week", "weeks"].includes(unit)) return value * 7 * 24 * 60 * 60 * 1000;
    if (["mo", "month", "months"].includes(unit)) return value * 30 * 24 * 60 * 60 * 1000; // Approximate month as 30 days
    return null;
}

function randomDelay(min = 10000, max = 25000) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const getNotifications = async (req, res, next) => {
    try {
        const result = await axios.get(process.env.NOTIFICATION_API_URL + "/notifications/");
        const notificationsData = result.data;
        res.json(notificationsData);
    }
    catch (err) {
        next(err);
    }
};

const sendNotifications = async (req, res, next) => {
    try {
        const result = await axios.get(process.env.NOTIFICATION_API_URL + "/notifications/");
        const notificationsData = result.data;
        for (const notification of notificationsData) {
            const notificationId = notification._id;
            for (const rule of notification.rules) {
                const ruleId = rule.ruleId;
                for (const project of rule.notifications) {
                    const { sentAt, frequency, recipientId, message } = project;
                    const now = Date.now();
                    let shouldSend = false;
                    if (!sentAt) {
                        shouldSend = true;
                    } else {
                        const lastSent = new Date(sentAt).getTime();
                        const freqMs = parseFrequency(frequency);
                        if (freqMs && now - lastSent >= freqMs) {
                            shouldSend = true;
                        }
                    }
                    if (shouldSend) {
                        try {
                            let phone = recipientId.phone;

                            if (phone.length === 10) {
                                phone = '91' + phone;
                            }
                            console.log('Sending WhatsApp message to:', phone);
                            await whatsappService.sendMessage(phone, message);
                            // update notification sentAt information
                            const data = {
                                ruleId: ruleId._id,
                                recipientId: recipientId._id,
                                nextSendAt: new Date(now + parseFrequency(frequency)).toISOString(),
                                sentAt: new Date().toISOString()
                            };

                            console.log('Updating notification with data:', data);
                            console.log('Updating notification with url:', process.env.NOTIFICATION_API_URL + `/notifications/${notificationId}`);

                            const updateResponse = await axios.put(
                                process.env.NOTIFICATION_API_URL + `/notifications/${notificationId}`,
                                data
                            );

                            // console.log('Update response:', updateResponse.status, updateResponse.data);
                        } catch (err) {
                            console.error('Failed to send WhatsApp message:', err);
                        }
                        // Wait random 10-25 seconds before next message
                        await new Promise(resolve => setTimeout(resolve, randomDelay()));
                    }
                }
            }
        }
        res.json(notificationsData);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getNotifications,
    sendNotifications
};