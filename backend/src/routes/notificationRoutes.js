const router = require('express').Router();
const {getNotifications} = require('../controllers/notificationController');

router.get('/', getNotifications);

module.exports = router;