const pool = require('../config/db');
const { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } = require('../utils/authUtils');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const [existing] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashedPassword, role || 'Student']
        );

        res.status(201).json({ message: 'User registered successfully', userId: result.insertId });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        // Save refresh token to DB
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
        await pool.execute(
            'INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)',
            [user.id, refreshToken, expiresAt]
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.json({
            accessToken,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });

        const [tokens] = await pool.execute('SELECT * FROM refresh_tokens WHERE token = ?', [refreshToken]);
        if (tokens.length === 0) return res.status(403).json({ message: 'Invalid token' });

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const [users] = await pool.execute('SELECT * FROM users WHERE id = ?', [decoded.id]);
        if (users.length === 0) return res.status(403).json({ message: 'User not found' });

        const user = users[0];
        const newAccessToken = generateAccessToken(user);

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        res.status(403).json({ message: 'Token verification failed' });
    }
};

const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (refreshToken) {
            await pool.execute('DELETE FROM refresh_tokens WHERE token = ?', [refreshToken]);
        }
        res.clearCookie('refreshToken');
        res.json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { register, login, refresh, logout };
