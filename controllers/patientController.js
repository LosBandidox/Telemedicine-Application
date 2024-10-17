const db = require('../config/db');
const bcrypt = require('bcrypt');

// Register Patient
exports.registerPatient = async (req, res) => {
    const { first_name, last_name, email, password, phone, date_of_birth, gender, address } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO Patients (first_name, last_name, email, password_hash, phone, date_of_birth, gender, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [first_name, last_name, email, hashedPassword, phone, date_of_birth, gender, address]
        );
        res.status(201).json({ message: 'Patient registered successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Patient Login
exports.loginPatient = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM Patients WHERE email = ?', [email]);

        if (rows.length > 0) {
            const patient = rows[0];

            const isMatch = await bcrypt.compare(password, patient.password_hash);
            if (isMatch) {
                req.session.patientId = patient.id;
                res.status(200).json({ message: 'Login successful' });
            } else {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(400).json({ message: 'No patient found with this email' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { first_name, last_name, phone, date_of_birth, gender, address } = req.body;
    const patientId = req.session.patientId;

    try {
        await db.query(
            'UPDATE Patients SET first_name = ?, last_name = ?, phone = ?, date_of_birth = ?, gender = ?, address = ? WHERE id = ?',
            [first_name, last_name, phone, date_of_birth, gender, address, patientId]
        );
        res.status(200).json({ message: 'Profile updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete Account
exports.deletePatient = async (req, res) => {
    const patientId = req.session.patientId;

    try {
        await db.query('DELETE FROM Patients WHERE id = ?', [patientId]);
        req.session.destroy();
        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
