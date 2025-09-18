import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlane, faFutbol, faMapMarkerAlt, faClock, faTimes } from '@fortawesome/free-solid-svg-icons';

const Modal = ({
  show,
  onClose,
  title,
  children,
  actions,
  icon,
  isEnhanced = false,
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isEnhanced ? 'enhanced-modal' : ''}`} onClick={e => e.stopPropagation()}>
        <div className={`modal-header ${isEnhanced ? 'enhanced-modal-header' : ''}`}>
          <h3>
            {icon && <span className="modal-header-icon">{icon}</span>}
            {title}
          </h3>
          <button onClick={onClose} className="close-button">
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <form className={`modal-form ${isEnhanced ? 'enhanced-modal-form' : ''}`} onSubmit={actions?.onSubmit}>
          {children}
          <div className={`modal-actions ${isEnhanced ? 'enhanced-modal-actions' : ''}`}>
            {actions?.buttons}
          </div>
          <div className='error-message' style={{ textAlign: 'center', marginTop: '1rem' }}>
            {actions?.errorMessage}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;