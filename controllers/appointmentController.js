const db = require('../config/db');

// Book Appointment
exports.bookAppointment = async (req, res) => {
    const { doctor_id, appointment_date, appointment_time } = req.body;
    try {
        await db.query(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time)
             VALUES (?, ?, ?, ?)`,
            [req.session.patientId, doctor_id, appointment_date, appointment_time]
        );
        res.send('Appointment booked');
    } catch (error) {
        res.status(500).send('Error booking appointment');
    }
};

// Get Appointments
exports.getAppointments = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM appointments WHERE patient_id = ?',
            [req.session.patientId]
        );
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error retrieving appointments');
    }
};


