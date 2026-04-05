import BrandMark from "./BrandMark";

const footerLinks = [
  { label: "Privacy", href: "/privacypolicy", disabled: true },
  { label: "Terms", href: "/terms", disabled: true },
  { label: "Cookies", href: "/cookiepolicy", disabled: true },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__brand">
            <BrandMark />
            <span className="footer__brand-copy">
              <span className="footer__brand-title">Booking System</span>
              <span className="footer__brand-subtitle">Secure resource booking</span>
            </span>
          </div>

          <nav className="footer__nav" aria-label="Footer">
            {footerLinks.map((item, index) => (
              <span key={item.label} className="footer__nav-group">
                <a
                  href={item.href}
                  className={`footer__nav-link ${item.disabled ? "footer__nav-link--disabled" : ""}`.trim()}
                  aria-disabled={item.disabled ? "true" : undefined}
                >
                  {item.label}
                </a>
                {index < footerLinks.length - 1 ? <span aria-hidden="true">|</span> : null}
              </span>
            ))}
          </nav>
        </div>

        <div className="footer__divider">
          © {currentYear} Ville Heikkiniemi. All rights reserved. Source code licensed under the MIT License.
        </div>
      </div>
    </footer>
  );
}
