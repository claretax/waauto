const router = require('express').Router();
const {getNotifications, sendNotifications} = require('../controllers/notificationController');

router.get('/', getNotifications);
 router.get('/sendAll', sendNotifications)
module.exports = router;