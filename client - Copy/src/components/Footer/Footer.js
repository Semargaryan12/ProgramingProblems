import React from 'react';
import { FaEnvelope, FaPhoneAlt, FaUniversity } from 'react-icons/fa';
import './Footer.css';

const Footer = ({ isVisible, hideFooter }) => {
  return (
    <footer 
      className={`footer ${isVisible ? "show" : "hide"}`} 
      onClick={hideFooter}
    >
      <div className="footer-content">
        <div className="footer-item">
          <span className="footer-icon">
            <FaUniversity />
          </span>
          <span className="footer-text company-name">CodeLabs</span>
        </div>
        <div className="footer-item">
          <span className="footer-icon">
            <FaEnvelope />
          </span>
          <span className="footer-text">support@CodeLabs.am</span>
        </div>
        <div className="footer-item">
          <span className="footer-icon">
            <FaPhoneAlt />
          </span>
          <span className="footer-text">+374 10 21 21 21</span>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 CodeLabs. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
