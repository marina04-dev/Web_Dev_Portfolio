const jwt = require('jsonwebtoken');
const pool = require('../utils/database');

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const [users] = await pool.execute('SELECT id, username FROM users WHERE username = ?', [decoded.username]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        req.user = users[0];
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { authenticate };