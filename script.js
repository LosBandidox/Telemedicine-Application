// Registration Form
document.getElementById('registrationForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    validateRegistration();
});

// Login Form
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    validateLogin();
});

function validateRegistration() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const age = document.getElementById('age').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const country = document.getElementById('country').value;
    const terms = document.getElementById('terms').checked;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return false;
    }

    if (!terms) {
        alert("Please accept the terms and conditions.");
        return false;
    }

    displayFormSummary(name, email, age, gender, country);
}

function displayFormSummary(name, email, age, gender, country) {
    let summary = `
        Name: ${name}<br>
        Email: ${email}<br>
        Age: ${age}<br>
        Gender: ${gender}<br>
        Country: ${country}<br>
    `;
    document.getElementById('summary').innerHTML = summary;
}

function validateLogin() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    if (email === '' || password === '') {
        alert("Please enter your email and password.");
        return false;
    }

    alert("Login successful");
}

// Appointment Booking
document.getElementById('appointmentForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    bookAppointment();
});

function bookAppointment() {
    const doctor = document.getElementById('doctor').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;

    if (doctor === '' || date === '' || time === '') {
        alert("Please complete all fields.");
        return false;
    }

    const appointmentDetails = `
        Doctor: ${doctor}<br>
        Date: ${date}<br>
        Time: ${time}<br>
    `;
    document.getElementById('appointmentDetails').innerHTML = appointmentDetails;
    alert("Appointment booked successfully.");
}

// Function to cancel the booked appointment
function cancelAppointment() {
    document.getElementById('appointmentDetails').innerHTML = "";
    alert("Appointment canceled.");
}

// Profile Management
document.getElementById('profileForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    updateProfile();
});

function updateProfile() {
    const name = document.getElementById('profileName').value;
    const email = document.getElementById('profileEmail').value;
    const age = document.getElementById('profileAge').value;
    const gender = document.querySelector('input[name="profileGender"]:checked')?.value;

    if (name === '' || email === '' || age === '' || !gender) {
        alert("Please complete all fields.");
        return false;
    }

    alert("Profile updated successfully.");
}

// Sample doctor data (this can later be connected to a database)
const doctors = [
    { id: 'dr_smith', name: 'Dr. Smith', specialization: 'Cardiologist', availability: ['9:00 AM', '11:00 AM'] },
    { id: 'dr_jones', name: 'Dr. Jones', specialization: 'Pediatrician', availability: ['2:00 PM', '4:00 PM'] },
    { id: 'dr_khan', name: 'Dr. Khan', specialization: 'General Practitioner', availability: ['9:00 AM', '2:00 PM'] }
];

// Load available doctors on Find Doctor page
window.onload = function() {
    const doctorList = document.getElementById('doctorList');

    if (doctorList) {
        // Dynamically load available doctors with "Book Appointment" button
        doctors.forEach(doctor => {
            const doctorDiv = document.createElement('div');
            doctorDiv.className = 'doctor-item';
            doctorDiv.innerHTML = `
                <h4>${doctor.name} (${doctor.specialization})</h4>
                <p>Available Slots: ${doctor.availability.join(', ')}</p>
                <button onclick="bookDoctor('${doctor.name}', '${doctor.availability[0]}')">Book Appointment</button>
            `;
            doctorList.appendChild(doctorDiv);
        });
    }

    // Doctor role access control for the "Manage Doctor Schedule" page
    const userRole = sessionStorage.getItem('role');
    if (window.location.pathname.includes('doctor-schedule.html') && userRole !== 'doctor') {
        alert("Access denied! Only doctors can manage their schedules.");
        window.location.href = 'index.html';
    }
}

// Function to handle appointment booking from the doctor list
function bookDoctor(doctorName, timeSlot) {
    const appointmentDetails = `
        Doctor: ${doctorName}<br>
        Time: ${timeSlot}<br>
    `;
    document.getElementById('appointmentDetails').innerHTML = appointmentDetails;
    alert("Appointment booked successfully.");
}

// Doctor Schedule Management
document.getElementById('scheduleForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    updateSchedule();
});

function updateSchedule() {
    const specialization = document.getElementById('specialization').value;
    const day = document.getElementById('availabilityDay').value;
    const time = document.getElementById('availabilityTime').value;

    if (specialization && day && time) {
        alert(`Schedule updated for ${specialization}: ${day} at ${time}`);
        // Dynamically update schedule (this should be stored in a backend later)
        const scheduleList = document.getElementById('scheduleList');
        const listItem = document.createElement('li');
        listItem.textContent = `${specialization}: ${day} at ${time}`;
        scheduleList.appendChild(listItem);
    } else {
        alert('Please fill in all fields.');
    }
}
function ensureAuthenticated(req, res, next) {
    if (req.session.patientId) {
        return next();
    } else {
        res.status(401).send('Please log in to access this resource.');
    }
}
router.get('/profile', ensureAuthenticated, patientController.viewProfile);
// patientRoutes.js
const express = require('express');
const patientController = require('../controllers/patientController');
const router = express.Router();

router.post('/register', patientController.registerPatient);
router.post('/login', patientController.loginPatient);
router.put('/profile', patientController.updateProfile);
router.delete('/delete', patientController.deletePatient);

module.exports = router;
