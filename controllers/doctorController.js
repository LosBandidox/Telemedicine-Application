const db = require('../config/db');

// Create Doctor
exports.createDoctor = async (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;

    try {
        await db.query(
            'INSERT INTO Doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)',
            [first_name, last_name, specialization, email, phone, schedule]
        );
        res.status(201).json({ message: 'Doctor added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Doctor Schedule
exports.updateDoctorSchedule = async (req, res) => {
    const { doctorId, schedule } = req.body;

    try {
        await db.query('UPDATE Doctors SET schedule = ? WHERE id = ?', [schedule, doctorId]);
        res.status(200).json({ message: 'Schedule updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
