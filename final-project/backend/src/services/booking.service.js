// src/services/booking.service.js
import pool from "../db/pool.js";

export async function createBooking(fullName, email, bookingDate, attendees) {
  const sql = `
    INSERT INTO bookings (full_name, email, booking_date, attendees)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name, email, booking_date, attendees, created_at
  `;

  const params = [fullName, email, bookingDate, attendees];
  const { rows } = await pool.query(sql, params);

  return rows[0];
}

export async function getAllBookings() {
  const sql = `
    SELECT id, full_name, email, booking_date, attendees, created_at
    FROM bookings
    ORDER BY created_at DESC
  `;

  const { rows } = await pool.query(sql);
  return rows;
}

export async function getBookingById(id) {
  const sql = `
    SELECT id, full_name, email, booking_date, attendees, created_at
    FROM bookings
    WHERE id = $1
  `;

  const { rows } = await pool.query(sql, [id]);
  return rows[0] || null;
}
