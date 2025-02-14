const express = require('express');
const router = express.Router();
const forgottenController = require('../controllers/forgottenController');

router.post('/api/forgotten', forgottenController.eraseData);

module.exports = router;
