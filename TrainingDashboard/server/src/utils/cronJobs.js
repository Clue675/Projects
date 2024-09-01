const cron = require('node-cron');
const Department = require('../models/Department');
const Employee = require('../models/Employee');

async function updateEmployeesDepartments() {
  try {
    // Find all employees
    const employees = await Employee.find();

    // Iterate over each employee
    for (const employee of employees) {
      // Check if the employee is linked to a department
      if (employee.department) {
        // Find the department linked to the employee
        const department = await Department.findById(employee.department);

        // Check if the department is linked to a division
        if (department && department.division) {
          // Update the department's employees array with the employee's _id
          if (!department.employees.includes(employee._id)) {
            department.employees.push(employee._id);
            await department.save();
            console.log(`Employee ${employee.firstName} ${employee.lastName} added to department ${department.name}`);
          }
        }
      }
    }
    console.log('Employee department update completed.');
  } catch (error) {
    console.error('Error updating employee departments:', error);
    // Handle error
  }
}

module.exports = async (req, res, next) => {
  // Schedule the function to run every hour
  cron.schedule('0 * * * *', async () => {
    // Call the function to update employees' departments
    await updateEmployeesDepartments();
  });

  console.log('Cron job scheduled for updating employee departments.');

  next();
};
