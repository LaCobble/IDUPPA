const express = require('express');
const router = express.Router();
const rectificationController = require('../controllers/rectificationController');

router.post('/api/rectification', rectificationController.rectifyData);

module.exports = router;
