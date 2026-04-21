import React from 'react';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import './Footer.css';

/* ── Same CodeLabs SVG logo as Navbar ───────────────── */
const CodeLabsLogo = () => (
  <svg
    className="footer-logo-svg"
    viewBox="0 0 38 38"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="CodeLabs"
  >
    <path
      d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z"
      fill="url(#ft-grad)"
      opacity="0.15"
    />
    <path
      d="M19 2L34.5 11V29L19 38L3.5 29V11L19 2Z"
      stroke="url(#ft-grad)"
      strokeWidth="1.5"
    />
    <path
      d="M13 15L8 19L13 23"
      stroke="#58a6ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25 15L30 19L25 23"
      stroke="#58a6ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 13L17 25"
      stroke="#3fb950"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="ft-grad" x1="3.5" y1="2" x2="34.5" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#58a6ff" />
        <stop offset="1" stopColor="#3fb950" />
      </linearGradient>
    </defs>
  </svg>
);

const Footer = ({ isVisible, hideFooter }) => {
  return (
    <footer
      id="contacts-section"
      className={`cl-footer ${isVisible ? 'cl-footer--show' : 'cl-footer--hide'}`}
      onClick={hideFooter}
    >
      <div className="cl-footer-inner">

        {/* Brand block */}
        <div className="cl-footer-brand">
          <div className="cl-footer-logo">
            <CodeLabsLogo />
            <span className="cl-footer-logo-text">
              Code<span className="cl-footer-logo-accent">Labs</span>
            </span>
          </div>
          <p className="cl-footer-tagline">
            Սովորիր: Կոդ Գրիր: Հաջողվիր:
          </p>
        </div>

        {/* Divider */}
        <div className="cl-footer-divider" />

        {/* Contact items */}
        <div className="cl-footer-contacts">
          <a
            href="mailto:support@CodeLabs.am"
            className="cl-footer-item"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="cl-footer-item-icon">
              <FaEnvelope />
            </span>
            <span className="cl-footer-item-text">support@CodeLabs.am</span>
          </a>

          <a
            href="tel:+37410212121"
            className="cl-footer-item"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="cl-footer-item-icon">
              <FaPhoneAlt />
            </span>
            <span className="cl-footer-item-text">+374 10 21 21 21</span>
          </a>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="cl-footer-bottom">
        <p>&copy; {new Date().getFullYear()} CodeLabs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;