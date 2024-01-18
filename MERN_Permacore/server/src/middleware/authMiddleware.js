const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

const authMiddleware = {
    // Middleware to authenticate and set user in the request
    authenticate: async (req, res, next) => {
        try {
            const token = req.header('Authorization').replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });

            if (!user) {
                throw new Error();
            }

            req.token = token;
            req.user = user;
            next();
        } catch (error) {
            res.status(401).send({ message: 'Please authenticate.' });
        }
    },

    // Middleware to check if the authenticated user is of role 'SupplierQuality'
    isSupplierQuality: (req, res, next) => {
        if (req.user && req.user.role === 'SupplierQuality') {
            next();
        } else {
            res.status(403).send({ message: 'Access denied: Insufficient permissions.' });
        }
    },

    // You can add more role-based middleware functions as needed
};

module.exports = authMiddleware;
