import express from "express";
import { getProviderBookings, updateProviderBookingStatus } from "../controllers/providerBookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", getProviderBookings);
router.patch("/:id/status", updateProviderBookingStatus);

export default router;
