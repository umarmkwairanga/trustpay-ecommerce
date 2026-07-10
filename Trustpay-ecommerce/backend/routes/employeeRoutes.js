// routes/employeeRoutes.js
const express = import('express');
const router = express.Router();
const { createEmployee, getAllEmployees, updateEmployeeStatus, deleteEmployee } = import('../controllers/employeeController');
const { protect } = import('./authMiddleware'); // Your existing auth check
const { restrictToAdmin } = import('../middleware/authMiddleware');

// All these routes now import the user to be logged in AND be an Admin
router.use(protect, restrictToAdmin);

router.post('/create', createEmployee);
router.get('/', getAllEmployees);
router.patch('/:id/status', updateEmployeeStatus);
router.delete('/:id', deleteEmployee);

module.exports = router;