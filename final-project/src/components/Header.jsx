import BrandMark from "./BrandMark";

const navigation = [
  { label: "Resources", href: "/resources", disabled: true },
  { label: "Reservations", href: "/reservations", disabled: true },
  { label: "Register", href: "/register", disabled: false },
  { label: "Sign in", href: "/login", disabled: false },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <a href="/" className="brand" aria-label="Booking System home">
          <BrandMark />
          <span className="brand__copy">
            <span className="brand__title">Booking System</span>
            <span className="brand__subtitle">Secure resource booking</span>
          </span>
        </a>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`site-nav__link ${item.disabled ? "site-nav__link--disabled" : ""}`.trim()}
              aria-disabled={item.disabled ? "true" : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
