const express = require('express');
const router = express.Router();
const dataController = require('../controllers/dataController');

router.get('/api/dataAccessRight', dataController.getPersonalDataValues);

module.exports = router;
