import BookingsSection from "../components/BookingsSection";
import Hero from "../components/Hero";

const bookings = [
  {
    resource: "Conference Room A",
    start: "Mon, 08 Apr 2026 · 09:00",
    end: "Mon, 08 Apr 2026 · 10:30",
  },
  {
    resource: "Projector Kit",
    start: "Mon, 08 Apr 2026 · 11:00",
    end: "Mon, 08 Apr 2026 · 13:00",
  },
  {
    resource: "Design Lab",
    start: "Tue, 09 Apr 2026 · 12:00",
    end: "Tue, 09 Apr 2026 · 14:30",
  },
  {
    resource: "Meeting Pod 2",
    start: "Wed, 10 Apr 2026 · 08:30",
    end: "Wed, 10 Apr 2026 · 09:15",
  },
];

const statusContent = {
  badge: "Guest",
  heading: "Welcome!",
  lead: "Sign in to manage your reservations and view booking owners.",
  body: "Administrators and managers get extended rights and gain access to broader functionalities than a reserver.",
  note: "Use the form page to submit a new booking request.",
  primaryAction: {
    href: "/form",
    label: "Open form",
  },
  secondaryAction: {
    href: "#bookings",
    label: "Browse bookings",
  },
};

const heroContent = {
  badge: "Privacy-First Availability Overview",
  title: "Simplify Resource Booking – Securely",
  description:
    "Simplify resource and user management in one secure system. Show availability publicly without exposing personal details.",
  primaryAction: {
    href: "/form",
    label: "Open form",
  },
  secondaryAction: {
    href: "#bookings",
    label: "View bookings",
  },
};

export default function HomePage() {
  return (
    <>
      <Hero content={heroContent} status={statusContent} />
      <BookingsSection bookings={bookings} />
    </>
  );
}
