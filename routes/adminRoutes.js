const express = require('express');
const { registerAdmin, loginAdmin, getAllPatients, getAllDoctors, getAllAppointments, deletePatient, deleteDoctor } = require('../controllers/adminController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Admin registration
router.post('/register', registerAdmin);

// Admin login
router.post('/login', loginAdmin);

// Get all patients (admin-only route)
router.get('/patients', isAuthenticated, isAdmin, getAllPatients);

// Get all doctors (admin-only route)
router.get('/doctors', isAuthenticated, isAdmin, getAllDoctors);

// Get all appointments (admin-only route)
router.get('/appointments', isAuthenticated, isAdmin, getAllAppointments);

// Delete a patient (admin-only route)
router.delete('/patients/:id', isAuthenticated, isAdmin, deletePatient);

// Delete a doctor (admin-only route)
router.delete('/doctors/:id', isAuthenticated, isAdmin, deleteDoctor);

module.exports = router;
