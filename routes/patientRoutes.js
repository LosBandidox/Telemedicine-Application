const express = require('express');
const patientController = require('../controllers/patientController');
const router = express.Router();

router.post('/register', patientController.registerPatient);
router.post('/login', patientController.loginPatient);
router.get('/profile', patientController.viewProfile);
router.put('/profile', patientController.updateProfile);
router.post('/logout', patientController.logout);

module.exports = router;


