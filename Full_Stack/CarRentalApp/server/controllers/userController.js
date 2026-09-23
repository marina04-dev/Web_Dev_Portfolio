import User from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Car from "../models/Car.js";

// token generation function
const generateToken = (userId) => {
    const payload = userId;
    return jwt.sign(payload, process.env.JWT_SECRET);
}

// API for user registration 
export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password || password.length < 8) {
            res.json({ success: false, message: 'Missing Required Fields!' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.json({ success: false, message: 'User Already Exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });
        const token = generateToken(user._id.toString());

        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// API for user login 
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'User Not Found!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid Credentials!' });
        }

        const token = generateToken(user._id.toString());

        res.json({ success: true, token });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// API to get user data using token (jwt)
export const getUserData = async (req, res) => {
    try {
        const { user } = req;
        res.json({ success: true, user });
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// API to get all cars for frontend
export const getCars = async (req, res) => {
    try {
        const cars = await Car.find({ isAvailable: true });
        res.json({ success: true, cars });
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}