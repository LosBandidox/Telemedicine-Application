const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

// Admin registration
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    await Admin.create(name, email, password);
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (err) {
    next(err);
  }
};

// Admin login
exports.loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const [admin] = await Admin.findByEmail(email);
    
    if (!admin || !(await Admin.verifyPassword(password, admin.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: admin.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    req.session.token = token;

    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    next(err);
  }
};

// Fetch all patients
exports.getAllPatients = async (req, res, next) => {
  try {
    const [patients] = await Patient.findAll();
    res.status(200).json(patients);
  } catch (err) {
    next(err);
  }
};

// Fetch all doctors
exports.getAllDoctors = async (req, res, next) => {
  try {
    const [doctors] = await Doctor.findAll();
    res.status(200).json(doctors);
  } catch (err) {
    next(err);
  }
};

// Fetch all appointments
exports.getAllAppointments = async (req, res, next) => {
  try {
    const [appointments] = await Appointment.findAll();
    res.status(200).json(appointments);
  } catch (err) {
    next(err);
  }
};

// Admin can delete a patient
exports.deletePatient = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Patient.deleteById(id);
    res.status(200).json({ message: 'Patient deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// Admin can delete a doctor
exports.deleteDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Doctor.deleteById(id);
    res.status(200).json({ message: 'Doctor deleted successfully' });
  } catch (err) {
    next(err);
  }
};
