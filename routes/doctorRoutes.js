const express = require('express');
const doctorController = require('../controllers/doctorController');
const router = express.Router();

router.post('/add', doctorController.addDoctor);
router.get('/list', doctorController.getDoctors);

module.exports = router;


