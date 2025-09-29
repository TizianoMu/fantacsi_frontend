import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© 2025 Fantacsi. Tutti i diritti riservati.</span>
        <span>
          <a href="/contact" className="footer-link">Contatti</a> | 
          <a href="/privacy" className="footer-link">Privacy</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;
