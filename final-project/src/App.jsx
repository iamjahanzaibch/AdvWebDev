import Header from "./components/Header";
import Hero from "./components/Hero";
import BookingsSection from "./components/BookingsSection";
import Footer from "./components/Footer";

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
  note: "Don’t have an account yet? Register to get started.",
  primaryAction: {
    href: "/register",
    label: "Register",
  },
  secondaryAction: {
    href: "/login",
    label: "Sign in",
  },
};

const heroContent = {
  badge: "Privacy-First Availability Overview",
  title: "Simplify Resource Booking – Securely",
  description:
    "Simplify resource and user management in one secure system. Show availability publicly without exposing personal details.",
  primaryAction: {
    href: "/login",
    label: "Get started",
  },
  secondaryAction: {
    href: "/bookings",
    label: "View bookings",
  },
};

export default function App() {
  return (
    <div className="app-shell">
      <Header />
      <main className="page-main">
        <Hero content={heroContent} status={statusContent} />
        <BookingsSection bookings={bookings} />
      </main>
      <Footer />
    </div>
  );
}
