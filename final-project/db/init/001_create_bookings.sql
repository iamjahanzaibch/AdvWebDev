-- db/init/001_create_bookings.sql
CREATE TABLE IF NOT EXISTS bookings (
  id          SERIAL PRIMARY KEY,
  full_name   VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  booking_date DATE NOT NULL,
  attendees   INTEGER NOT NULL CHECK (attendees >= 1 AND attendees <= 8),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on created_at for faster queries
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings (created_at DESC);
