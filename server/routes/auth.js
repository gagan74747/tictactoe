
const express = require('express');

const router = express.Router();
const authcontroller = require('../controllers/authController');

const { login, signup } = authcontroller;

router.post('/login', login);
router.post('/signup',  signup);

module.exports = router;
