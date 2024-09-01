const jwt = require('jsonwebtoken');
const config = require('../config'); // Ensure you have a config file with a secret key for JWT

function authenticate(req, res, next) {
    // Extract token from header
    const token = req.headers.authorization?.split(' ')[1]; // Format is usually "Bearer <token>"

    if (!token) {
        return res.status(401).send('Access denied. No token provided.');
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, config.jwtSecret);
        req.user = decoded; // Add the decoded user data to the request object

        next(); // Authentication successful, proceed to the next middleware
    } catch (err) {
        res.status(400).send('Invalid token.');
    }
}

module.exports = authenticate;
