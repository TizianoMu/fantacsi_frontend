import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span>© 2025 Fantacsi. Tutti i diritti riservati.</span>
        <span>
          <a href="mailto:info@fantacsi.com" className="footer-link">Contatti</a> | 
          <a href="/privacy" className="footer-link">Privacy</a> | 
          <a href="/terms" className="footer-link">Termini</a>
        </span>
      </div>
    </footer>
  );
};

export default Footer;