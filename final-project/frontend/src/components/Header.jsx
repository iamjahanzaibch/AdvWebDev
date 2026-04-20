import { Link } from "react-router-dom";
import BrandMark from "./BrandMark";

const navigation = [
  { label: "Form", href: "/form", disabled: false },
  { label: "Resources", href: "/resources", disabled: true },
  { label: "Reservations", href: "/reservations", disabled: true },
];

export default function Header() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link to="/" className="brand" aria-label="Booking System home">
          <BrandMark />
          <span className="brand__copy">
            <span className="brand__title">Booking System</span>
            <span className="brand__subtitle">Secure resource booking</span>
          </span>
        </Link>

        <nav className="site-nav" aria-label="Primary">
          {navigation.map((item) => (
            item.disabled ? (
              <span key={item.label} className="site-nav__link site-nav__link--disabled" aria-disabled="true">
                {item.label}
              </span>
            ) : (
              <Link key={item.label} to={item.href} className="site-nav__link">
                {item.label}
              </Link>
            )
          ))}
        </nav>
      </div>
    </header>
  );
}
