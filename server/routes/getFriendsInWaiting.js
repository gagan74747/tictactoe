const express = require("express");
const router = express.Router();
const getFriendsInWaiting = require('../controllers/getFriendsInWaiting')

router.get('/getFriendsInWaiting',getFriendsInWaiting)

module.exports = router;