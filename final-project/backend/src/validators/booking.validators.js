// src/validators/booking.validators.js
import { body } from "express-validator";

export const bookingValidators = [
  body("fullName")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Full name must be at least 3 characters"),
  body("emailAddress")
    .trim()
    .isEmail()
    .withMessage("Must be a valid email address"),
  body("bookingDate")
    .notEmpty()
    .withMessage("Booking date is required")
    .isISO8601()
    .withMessage("Booking date must be a valid date"),
  body("attendees")
    .isInt({ min: 1, max: 8 })
    .withMessage("Attendees must be between 1 and 8"),
];
