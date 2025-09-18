import React from 'react';
const NotFoundPage = () => {
  return (
    <div className="central-box">
      <h1 className="title">404 - Page Not Found</h1>
      <p className="message">Sorry, the page you are looking for does not exist.</p>
      <a href="/" className="button">Torna alla Home</a>
    </div>
  );
};

export default NotFoundPage;