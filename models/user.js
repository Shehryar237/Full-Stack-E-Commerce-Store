// models/user.js
const db = require('../util/db');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10);

class User {
    constructor(password, name = null, role = 'user', email = null) {
        this.id = uuidv4();
        this.password = password; // plain text until saved
        this.name = name;
        this.role = role;
        this.email = email;
    }

    async saveUser() {
        if (!this.password) throw new Error('Password required');
        const passHash = await bcrypt.hash(this.password, SALT_ROUNDS);
        const query = `
        INSERT INTO users (id, email, password_hash, name, role)
                VALUES ($1, $2, $3, $4, $5)`;
        await db.query(query,[this.id,this.email, passHash, this.name, this.role]);
        this.password = undefined;
    }

    static async findByEmail(email) {
        const res = await db.query(
        'SELECT id,  email, password_hash, name, role FROM users WHERE email = $1',
        [email]
        );
        return res.rows[0] || null;
    }

    static async findById(id) {
        const res = await db.query(
        'SELECT id,email, name, role FROM users WHERE id = $1',
        [id]
        );
        return res.rows[0] || null;
    }

    static async existsByEmail(email) {
        const r = await db.query('SELECT 1 FROM users WHERE email = $1 LIMIT 1', [email]);
        return r.rows.length > 0;
    }

    static async verifyPassword(plain, hash) {
        return bcrypt.compare(plain, hash);
    }
}

module.exports = User;
