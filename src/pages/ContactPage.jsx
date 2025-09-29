import React from 'react';
import ContactInfo from '../components/ContactInfo'; 

const ContactPage = () => {
  return (
    <div className="central-box">
      <div 
        className="auth-toggle-buttons"
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ margin: 0, color: 'var(--text-color, #333)' }}>Contatti</h2>
      </div>
      
      <div className="forms-wrapper">
        <ContactInfo />
      </div>
      
    </div>
  );
};

export default ContactPage;
