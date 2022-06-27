const authenticate = require('../middleware/authenticate')
const express = require('express');

const router = express.Router();
const gamecontroller = require('../controllers/gameController');

const{game}=gamecontroller

router.get('/game', authenticate,game);


module.exports = router;