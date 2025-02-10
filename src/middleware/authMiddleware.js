// middleware/auth.js
import jwt from 'jsonwebtoken';
import User from '../backend/models/User.js';


// Middleware to authenticate using JWT
const protect = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Extract token from 'Authorization' header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Save user info to request for use in other routes
        next();
    });
};

export default protect;