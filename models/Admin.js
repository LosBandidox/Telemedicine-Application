const db = require('../config/db');
const bcrypt = require('bcrypt');

// Admin model
const Admin = {
  async create(name, email, password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO admins (name, email, password) VALUES (?, ?, ?)';
    await db.query(query, [name, email, hashedPassword]);
  },

  async findByEmail(email) {
    const [result] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);
    return result;
  },

  async findById(id) {
    const [result] = await db.query('SELECT * FROM admins WHERE id = ?', [id]);
    return result;
  },

  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }
};

module.exports = Admin;
