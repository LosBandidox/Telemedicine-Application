// Import necessary modules
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// Initialize Express app
const app = express();

// Middleware for parsing request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for session management
app.use(session({
    secret: 'your_secret_key', // Change this to a secure key
    resave: false,
    saveUninitialized: true,
}));

// Serve static files (CSS, JS, HTML)
app.use(express.static('public'));

// MySQL connection pool setup
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Shama@2006',
    database: 'hospital_db',
    port: 3306
});

// Test database connection
db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to the database!');
    connection.release(); // Release the connection back to the pool
});

// Admin Login route
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    // Check if the username exists
    db.query('SELECT * FROM admin WHERE username = ?', [username], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        if (results.length === 0) return res.status(401).json({ message: 'Invalid username or password' });
        
        const admin = results[0];
        // Compare the provided password with the hashed password in the database
        bcrypt.compare(password, admin.password_hash, (err, isMatch) => {
            if (err || !isMatch) {
                return res.status(401).json({ message: 'Invalid username or password' });
            }

            // Start a session for the admin
            req.session.adminId = admin.id; // Store admin ID in session
            res.json({ message: 'Admin logged in successfully' });
        });
    });
});

// Get all doctors (Admin only)
app.get('/admin/doctors', (req, res) => {
    // Ensure that the request comes from an authenticated admin
    if (!req.session.adminId) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Fetch all doctors from the database
    db.query('SELECT * FROM doctors', (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(results); // Send the list of doctors as a response
    });
});

// Add a new doctor (Admin only)
app.post('/admin/doctors', (req, res) => {
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
    // Insert new doctor into the database
    db.query('INSERT INTO doctors (first_name, last_name, specialization, email, phone, schedule) VALUES (?, ?, ?, ?, ?, ?)', 
    [first_name, last_name, specialization, email, phone, schedule], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.status(201).json({ id: results.insertId }); // Respond with the new doctor's ID
    });
});

// Update a doctor's information (Admin only)
app.put('/admin/doctors/:id', (req, res) => {
    const { id } = req.params;
    const { first_name, last_name, specialization, email, phone, schedule } = req.body;
    // Update the doctor's information in the database
    db.query('UPDATE doctors SET first_name = ?, last_name = ?, specialization = ?, email = ?, phone = ?, schedule = ? WHERE id = ?', 
    [first_name, last_name, specialization, email, phone, schedule, id], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Doctor not found' });
        res.json({ message: 'Doctor updated successfully' }); // Confirm the update
    });
});

// Delete a doctor (Admin only)
app.delete('/admin/doctors/:id', (req, res) => {
    const { id } = req.params;
    // Delete the doctor from the database
    db.query('DELETE FROM doctors WHERE id = ?', [id], (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        if (results.affectedRows === 0) return res.status(404).json({ message: 'Doctor not found' });
        res.json({ message: 'Doctor deleted successfully' }); // Confirm deletion
    });
});

// Get all appointments (Admin only)
app.get('/admin/appointments', (req, res) => {
    // Ensure that the request comes from an authenticated admin
    if (!req.session.adminId) {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    // Fetch all appointments from the database
    db.query('SELECT * FROM appointments', (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(results); // Send the list of appointments as a response
    });
});

// Redirect to admin panel
app.get('/admin', (req, res) => {
    res.sendFile(__dirname + '/public/admin/index.html');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
