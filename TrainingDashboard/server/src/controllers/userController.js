const mongoose = require("mongoose");
const User = require("../models/User");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const config = require("../config");
const Division = require("../models/Divisions");
const Department = require("../models/Department");

// Create a new user

// Assuming User model has references to Division and Department
exports.getAllUsers = async (req, res) => {
  try {
    // Fetch all users and populate both division and department fields
    const users = await User.find({})
      .populate('divisionRef', 'name') // Assuming divisionRef is the reference field in User model for division
      .populate('departmentRef', 'name') // Assuming departmentRef is the reference field in User model for department
      .select('-password'); // Excludes passwords from the result

    // Optionally convert to a simpler object format if needed
    const usersData = users.map(user => {
      const userObject = user.toObject();
      // Rename divisionRef and departmentRef for clarity in the response
      if (userObject.divisionRef) {
        userObject.divisionName = userObject.divisionRef.name;
        delete userObject.divisionRef; // Remove the divisionRef object
      }
      if (userObject.departmentRef) {
        userObject.departmentName = userObject.departmentRef.name;
        delete userObject.departmentRef; // Remove the departmentRef object
      }
      return userObject;
    });

    res.status(200).json(usersData);
  } catch (error) {
    console.error('Error fetching all users:', error);
    res.status(500).json({ message: "Failed to fetch users", error: error.message });
  }
};



exports.createUser = async (req, res) => {
  try {
    // Destructure needed properties directly from the request body
    const { password, division: divisionId, ...otherUserData } = req.body;

    // Hash the password
    const hashedPassword = await argon2.hash(password);

    // Validate the division exists by ID
    const divisionExists = await Division.exists({ _id: divisionId });
    if (!divisionExists) {
      return res.status(400).json({ message: "Selected division not found." });
    }

    // Create a new user instance with the hashed password and division ID
    const newUser = new User({
      ...otherUserData,
      password: hashedPassword,
      divisionRef: divisionId, // Assuming the User model has a divisionRef field
    });

    // Save the new user to the database
    await newUser.save();

    // Respond with success message and the ID of the new user
    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser._id });
  } catch (err) {
    console.error("Error creating user:", err); // Log the full error for debugging
    res
      .status(500)
      .json({ message: "Error creating user", error: err.message });
  }
};

exports.authenticateUser = async (req, res) => {
    try {
      const { email, password } = req.body;
      // Populate division and department fields to access their names, if departmentRef exists in your schema
      const user = await User.findOne({ email: email.toLowerCase() }).populate("divisionRef")
      if (!user || !(await argon2.verify(user.password, password))) {
        return res.status(401).json({ message: "Email or password is incorrect" });
      }
      const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: "1h" });
  
      // Ensure division name is included in the response
      res.json({
        token,
        user: {
          id: user._id,
          email: user.email,
          divisionName: user.divisionRef ? user.divisionRef.name : "Division not found",
          // Update departmentName to use departmentRef if it exists in your schema
        //   departmentName: user.departmentRef ? user.departmentRef.name : "Department not found",
        },
      });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: error.message });
    }
  };
  

exports.findUser = async (req, res) => {
  try {
    let query = {};
    if (req.query.badgeNumber) {
      query.badgeNumber = req.query.badgeNumber;
    } else if (req.query.email) {
      query.email = req.query.email.toLowerCase();
    } else {
      return res.status(400).send("Insufficient data to identify user");
    }

    let user = await User.findOne(query)
      .populate("division", "name") // Populate division name
      .populate("department", "name"); // Populate department name

    if (!user) {
      return res.status(404).send("User not found");
    }

    // Convert the MongoDB document to a plain JavaScript object to manipulate it
    user = user.toObject();
    delete user.password; // Remove password from the response
    res.status(200).json(user);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  console.log(`Attempting to update user with ID: ${userId}`);
  
  try {
    const user = await User.findById(userId);
    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return res.status(404).json({ message: "User not found" });
    }

    // Update user with req.body data
    // For example, if updating the username:
    // user.username = req.body.username || user.username;

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (error) {
    console.error(`Error updating user: ${error}`);
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(204).send(); // Successfully deleted, no content to return
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).send(err.message);
  }
};

// Controller for getting all divisions
exports.fetchAllDivisions = async (req, res) => {
  try {
    const divisions = await getAllDivisions();
    res.json(divisions);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};
