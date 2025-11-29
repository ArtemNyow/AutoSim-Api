import { Router } from "express";
import {
  authenticate,
  authenticateOptional,
} from "../middleware/authenticate.js";
import {
  createBooking,
  getMyBookings,
  getAllBookings,
  updateBookingByAdmin,
  getSimulatorAvailabilitySlots,
} from "../controllers/bookingController.js";
import {
  checkAvailabilityValidation,
  createBookingValidation,
  updateBookingValidation,
} from "../validations/BookingValidation.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.post(
  "/booking",
  createBookingValidation,
  authenticateOptional,
  createBooking
);

router.get("/booking/me", authenticate, getMyBookings);

router.get("/booking", authenticate, isAdmin, getAllBookings);

router.patch(
  "/booking/:id",
  authenticate,
  isAdmin,
  updateBookingValidation,
  updateBookingByAdmin
);
router.get(
  "/simulators/:id/availability",
  checkAvailabilityValidation,
  getSimulatorAvailabilitySlots
);

export default router;
