// src/routes/bookings.routes.js
import express from "express";
import { validationResult } from "express-validator";
import { bookingValidators } from "../validators/booking.validators.js";
import {
  createBooking,
  getAllBookings,
  getBookingById,
} from "../services/booking.service.js";

const router = express.Router();

router.post("/", bookingValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      errors: errors.array().map((e) => ({ field: e.path, msg: e.msg })),
    });
  }

  const { fullName, emailAddress, bookingDate, attendees } = req.body;

  try {
    const booking = await createBooking(
      fullName,
      emailAddress,
      bookingDate,
      attendees
    );

    return res.status(201).json({
      ok: true,
      data: booking,
      message: "Booking created successfully",
    });
  } catch (err) {
    console.error("Booking creation failed:", err);
    return res.status(500).json({
      ok: false,
      error: "Failed to create booking",
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const bookings = await getAllBookings();
    return res.status(200).json({
      ok: true,
      data: bookings,
    });
  } catch (err) {
    console.error("Failed to fetch bookings:", err);
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch bookings",
    });
  }
});

router.get("/:id", async (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      ok: false,
      error: "Booking ID must be a positive integer",
    });
  }

  try {
    const booking = await getBookingById(id);

    if (!booking) {
      return res.status(404).json({
        ok: false,
        error: "Booking not found",
      });
    }

    return res.status(200).json({
      ok: true,
      data: booking,
    });
  } catch (err) {
    console.error("Failed to fetch booking:", err);
    return res.status(500).json({
      ok: false,
      error: "Failed to fetch booking",
    });
  }
});

export default router;
