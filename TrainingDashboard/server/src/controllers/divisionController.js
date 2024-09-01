const Division = require('../models/Divisions');
const Department = require('../models/Department');

exports.createDivision = async (req, res) => {
  try {
    const { name, description, departments } = req.body;
    
    // Validate the departments exist before creating the division
    if (departments && departments.length > 0) {
      const invalidDepartments = [];
      for (const departmentId of departments) {
        const departmentExists = await Department.findById(departmentId);
        if (!departmentExists) {
          invalidDepartments.push(departmentId);
        }
      }
      if (invalidDepartments.length > 0) {
        return res.status(400).json({ message: `Departments not found: ${invalidDepartments.join(', ')}` });
      }
    }

    const newDivision = new Division({
      name,
      description,
      departments
    });

    await newDivision.save();
    res.status(201).json(newDivision);
  } catch (error) {
    console.error('Error creating division:', error);
    res.status(500).json({ message: 'Failed to create division', error: error.message });
  }
};

exports.getAllDivisions = async (req, res) => {
  try {
    console.log('Fetching all divisions...');
    const divisions = await Division.find().populate('departments', ['name', '_id']);
    console.log('Divisions fetched successfully:', divisions);
    res.json(divisions);
  } catch (error) {
    console.error('Error fetching divisions:', error);
    res.status(500).json({ message: 'Failed to fetch divisions', error: error.message });
  }
};


exports.getDivision = async (req, res) => {
  try {
    const division = await Division.findById(req.params.id).populate('departments', 'name');
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }
    res.json(division);
  } catch (error) {
    console.error('Error fetching division:', error);
    res.status(500).json({ message: 'Failed to fetch division', error: error.message });
  }
};

exports.updateDivision = async (req, res) => {
  try {
    const { name, description, departments } = req.body;
    
    // Validate the departments exist before updating the division
    if (departments && departments.length > 0) {
      const invalidDepartments = [];
      for (const departmentId of departments) {
        const departmentExists = await Department.findById(departmentId);
        if (!departmentExists) {
          invalidDepartments.push(departmentId);
        }
      }
      if (invalidDepartments.length > 0) {
        return res.status(400).json({ message: `Departments not found: ${invalidDepartments.join(', ')}` });
      }
    }

    const division = await Division.findByIdAndUpdate(req.params.id, {
      name,
      description,
      departments
    }, { new: true }).populate('departments', 'name');

    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }

    res.json(division);
  } catch (error) {
    console.error('Error updating division:', error);
    res.status(500).json({ message: 'Failed to update division', error: error.message });
  }
};

exports.deleteDivision = async (req, res) => {
  try {
    const division = await Division.findByIdAndDelete(req.params.id);
    if (!division) {
      return res.status(404).json({ message: 'Division not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting division:', error);
    res.status(500).json({ message: 'Failed to delete division', error: error.message });
  }
};
