const pool = require('./database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const signupUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if the username already exists
        const [existingUsers] = await pool.execute('SELECT username FROM users WHERE username = ?', [username]);
        if (existingUsers.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Hash the password with a salt round of 10
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await pool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);

        // Respond with a success message
        res.status(201).json({ message: 'User registered successfully' });

    } catch (error) {
        console.error('Error during user signup:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const loginUser = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Find the user by username
        const [users] = await pool.execute('SELECT id, username, password FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = users[0];

        // Compare the entered password with the hashed password from the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
            // Generate a JWT token with user ID and username as payload, expiring in 1 hour
            const token = jwt.sign({ id: user.id, username: user.username }, process.env.SECRET_KEY, { expiresIn: '1h' });
            // Send the token back to the client
            res.json({ token });
        } else {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

module.exports = {
    signupUser,
    loginUser
};