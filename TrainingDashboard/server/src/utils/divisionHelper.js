const Division = require('../models/Divisions'); // Correct the path as needed

// Function to get all divisions
const getAllDivisions = async () => {
    try {
        const divisions = await Division.find({});
        return divisions; // Returns an array of division documents
    } catch (error) {
        console.error('Failed to fetch divisions:', error);
        throw error; // Rethrow the error so it can be caught where the function is called
    }
};

const getDepartmentsByDivision = async (req, res) => {
    try {
        const { divisionId } = req.params;
        const departments = await Department.find({ division: divisionId }).populate('division');
        if (departments.length === 0) {
            return res.status(404).send('No departments found for this division.');
        }
        res.json(departments);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = { getAllDivisions, getDepartmentsByDivision };
