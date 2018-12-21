const express = require('express');
const router = express.Router();

const testController = require('./api/controllers/test')
const secretController = require('./api/controllers/secret')
const registerController = require('./api/controllers/register')

router.get('/test', testController.index)

router.post('/test', testController.index)

router.get('/secret', secretController)

router.post('/register', registerController)

module.exports = router