const authenticate = require('../middleware/authenticate')
const express = require('express');
const router = express.Router();
const pushUserToRoom = require('../controllers/pushusertoroom');

const {pushUserIntoRoom}=pushUserToRoom;
router.post('/joinRoom', authenticate,pushUserIntoRoom);
module.exports = router;
