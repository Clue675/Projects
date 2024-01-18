const User = require('../../models/User'); // Adjust the path to your User model
const argon2 = require('argon2');
const jwt = require('jsonwebtoken');
const config = require('../../config/config'); // Adjust the path to your config

// User Registration
const registerUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        const existingUser = await User.findOne({ email: email.toLowerCase() });

        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await argon2.hash(password);
        const newUser = new User({
            firstName,
            lastName,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: "User successfully registered" });
    } catch (error) {
        res.status(500).json({ message: `Error registering user: ${error.message}` });
    }
};

// User Authentication (Login)
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await argon2.verify(user.password, password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ email: user.email }, config.jwtSecret, { expiresIn: "1h" });
        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        res.status(500).json({ message: `Error during login: ${error.message}` });
    }
};

// Update User Profile
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, password, role } = req.body;
        let updatedData = { firstName, lastName, email, role };

        if (password) {
            updatedData.password = await argon2.hash(password);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: `Error updating user: ${error.message}` });
    }
};

// Reassign User Role
const reassignRole = async (req, res) => {
    try {
        const { userId, newRole } = req.body;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.role = newRole;
        await user.save();

        res.status(200).json({ message: "User role updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: `Error updating user role: ${error.message}` });
    }
};

// Export all the controller functions
module.exports = {
    registerUser,
    loginUser,
    updateUser,
    reassignRole
};
