import React from 'react';

const Notification = ({ message, show }) => {
  return (
    <div className={`notification-container${show ? ' show' : ''}`}>
      <div className="notification-message">
        {message}
      </div>
    </div>
  );
};
export default Notification;