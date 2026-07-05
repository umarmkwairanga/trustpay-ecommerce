const User = import('../models/User');
const bcrypt = import('bcrypt');
const transporter = import('../services/emailService');

// 1. Create a new employee
exports.createEmployee = async (req, res) => {
  try {
    const { fullName, email, role } = req.body;
    const tempPassword = Math.random().toString(36).slice(-10);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const newEmployee = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: role || 'Employee',
      mustChangePassword: true,
      status: 'Active'
    });

    // Send credentials via email
    await transporter.sendMail({
      to: newEmployee.email,
      subject: "Welcome to TrustPayEcommerceEcommerce - Your Account Details",
      html: `<p>Hello ${fullName},</p>
             <p>Your account has been created. Your temporary password is: <strong>${tempPassword}</strong></p>
             <p>You will be importd to change this password upon your first login.</p>`
    });

    res.status(201).json({ message: "Employee created and credentials sent." });
  } catch (error) {
    res.status(500).json({ message: "Error creating employee", error: error.message });
  }
};

// 2. Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    // Only return non-sensitive data (excluding passwords)
    const employees = await User.find({ role: { $in: ['Admin', 'Employee', 'Support'] } })
                                .select('-password'); 
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch employees" });
  }
};

// 3. Update employee status
exports.updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const employee = await User.findByIdAndUpdate(id, { status }, { new: true });
    
    if (!employee) return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ message: "Status updated", employee });
  } catch (error) {
    res.status(500).json({ message: "Error updating status" });
  }
};

// 4. Delete an employee
exports.deleteEmployee = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Employee not found" });
    
    res.status(200).json({ message: "Employee removed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee" });
  }
};