const authenticate = require('../middleware/authenticate')
const express = require('express');
const router = express.Router();
const homecontroller = require('../controllers/homeController');
const{home}=homecontroller;

router.get('/home', authenticate,home);

module.exports = router;
