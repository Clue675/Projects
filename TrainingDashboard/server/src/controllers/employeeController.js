const Employee = require('../models/Employee');
const Department = require('../models/Department');
const Division = require('../models/Divisions');

exports.getEmployees = async (req, res) => {
  try {
    const query = {};
    if (req.query.firstName) {
      query.firstName = new RegExp(req.query.firstName, 'i'); // Case-insensitive search
    }
    if (req.query.lastName) {
      query.lastName = new RegExp(req.query.lastName, 'i'); // Case-insensitive search
    }
    if (req.query.badgeNumber) {
      query.badgeNumber = req.query.badgeNumber;
    }

    const employees = await Employee.find(query)
      .populate({
        path: 'department',
        populate: { path: 'division', select: 'name -_id' } // Nested populate for division
      })
      .populate({
        path: 'completedTrainings.trainingSession',
        select: 'title date -_id',
        populate: {
          path: 'department',
          select: 'name workCenter -_id' // Ensure workCenter is also selected
        }
      });

    const transformedEmployees = employees.map(employee => {
      const { completedTrainings, department, ...employeeInfo } = employee.toObject();

      // Check for null department or division and handle appropriately
      const departmentName = department?.name || 'Department Not Found';
      const divisionName = department?.division?.name || 'Division Not Found';
      const workCenter = department?.workCenter || 'N/A';

      const enhancedCompletedTrainings = completedTrainings.map(ct => ({
        ...ct,
        departmentName: ct.trainingSession?.department?.name || 'N/A',
        workCenter: ct.trainingSession?.department?.workCenter || 'N/A',
      }));

      return {
        ...employeeInfo,
        departmentName,
        divisionName,
        workCenter,
        completedTrainings: enhancedCompletedTrainings
      };
    });

    res.json(transformedEmployees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send(`Server error: ${err.message}`);
  }
};


exports.getAllEmployees = async (req, res) => {
  try {
    const query = {};
    if (req.query.firstName) {
      query.firstName = new RegExp(req.query.firstName, 'i'); // Case-insensitive search
    }
    if (req.query.lastName) {
      query.lastName = new RegExp(req.query.lastName, 'i'); // Case-insensitive search
    }
    if (req.query.badgeNumber) {
      query.badgeNumber = req.query.badgeNumber;
    }

    const employees = await Employee.find(query)
      .populate({
        path: 'department',
        populate: { path: 'division', select: 'name -_id' } // Nested populate for division
      })
      .populate('completedTrainings.trainingSession'); // Only populate completed trainings

    res.json(employees);
  } catch (err) {
    console.error("Error fetching employees:", err);
    res.status(500).send(`Server error: ${err.message}`);
  }
};


exports.getActiveEmployeesByDepartment = async (req, res) => {
  try {
    const activeEmployeesByDepartment = await Employee.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', activeEmployeesCount: { $sum: 1 } } },
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'department' } },
      { $unwind: '$department' },
      { $project: { departmentName: '$department.name', activeEmployeesCount: 1, _id: 0 } }
    ]);

    res.json(activeEmployeesByDepartment);
  } catch (err) {
    console.error("Error fetching active employees by department:", err);
    res.status(500).send(`Server error: ${err.message}`);
  }
};

exports.createEmployee = async (req, res) => {
  try {
    const { departmentName, ...employeeData } = req.body;

    if (!departmentName) {
      return res.status(400).json({ message: 'Department name is required' });
    }

    const department = await Department.findOne({ name: departmentName });
    if (!department) {
      return res.status(400).json({ message: 'Invalid department name' });
    }

    const newEmployee = new Employee({ ...employeeData, department: department._id });
    const savedEmployee = await newEmployee.save();

    department.employees.push(savedEmployee._id);
    await department.save();

    const savedEmployeeWithDetails = await Employee.findById(savedEmployee._id)
      .populate({
        path: 'department',
        populate: { path: 'division' } // Assuming division is necessary and populated within department
      });

    res.status(201).json(savedEmployeeWithDetails);
  } catch (err) {
    console.error("Error creating employee:", err);
    res.status(500).json({ message: err.message });
  }
};




exports.updateEmployee = async (req, res) => {
  try {
    const { departmentName, divisionName, ...updateData } = req.body;

    const department = await Department.findOne({ name: departmentName });
    const division = await Division.findOne({ name: divisionName });

    const updatedFields = { ...updateData };
    if (department) updatedFields.department = department._id;
    if (division) updatedFields.division = division._id;

    const employee = await Employee.findByIdAndUpdate(req.params.id, updatedFields, { new: true }).populate('department').populate('division');
    if (!employee) {
      return res.status(404).send('Employee not found');
    }
    res.json(employee);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getEmployeeByBadge = async (req, res) => {
  try {
    const employee = await Employee.findOne({ badgeNumber: req.params.badgeNumber });
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found for the provided badge number.' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.getEmployeesByName = async (req, res) => {
  try {
    const employees = await Employee.find({
      firstName: req.params.firstName,
      lastName: req.params.lastName
    });
    if (!employees.length) {
      return res.status(404).json({ message: 'No employees found with the provided name.' });
    }
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found for deletion.' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
