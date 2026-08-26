const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getVehicles,
  getVehicleById,
  createVehicle,
  requestInspection,
  purchaseVehicle
} = require('../controllers/vehicleController');

router.get('/', getVehicles);
router.get('/:id', getVehicleById);

router.use(protect);
router.post('/', authorize('seller', 'admin'), createVehicle);
router.post('/inspection', requestInspection);
router.post('/purchase', purchaseVehicle);

module.exports = router;