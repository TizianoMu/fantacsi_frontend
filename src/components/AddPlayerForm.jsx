import React, { useState } from 'react';
import { MAX_FILE_SIZE_MB } from '../utils/constants';

const AddPlayerForm = ({
  player,
  formState, setFormState,
  fileSizeError, setFileSizeError,
  isDragActive, setIsDragActive,
  handlePhotoChange,
  handleDrop,
  handleDragOver,
  handleDragLeave,
  handlePhotoClick,
  handleRemovePhoto,
  photoRequiredError, // nuovo prop per errore foto
  isFutsal
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="form-group">
        <label htmlFor="name">Nome del Giocatore <span style={{ color: 'red' }}>*</span></label>
        <input
          type="text"
          id="name"
          name="name"
          value={formState.name}
          placeholder='Nome del Giocatore'
          onChange={handleInputChange}
          required
          disabled={!!player}
          style={{ cursor: player ? 'not-allowed' : 'text' }}
          className="input-field"
        />
      </div>
      <div className="form-group">
        <label>Foto <span style={{ color: 'red' }}>*</span></label>
        <div
          className={`player-photo-dropzone${isDragActive ? ' player-photo-dropzone--active' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handlePhotoClick}
        >
          {formState.photoPreview ? (
            <>
              <img src={formState.photoPreview} alt="Photo Preview" className="player-photo-img" />
              <button type="button" className="player-remove-photo-btn" onClick={handleRemovePhoto}>
                &times;
              </button>
            </>
          ) : (
            <span>Carica Foto</span>
          )}
          <input
            type="file"
            id="player-photo-input"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handlePhotoChange}
          />
        </div>
        {fileSizeError && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
            La dimensione massima consentita è {MAX_FILE_SIZE_MB}MB.
          </p>
        )}
        {photoRequiredError && (
          <p style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
            La foto è obbligatoria.
          </p>
        )}
      </div>
      <div className="form-group">
        <label htmlFor="number">Numero di maglia <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          id="number"
          name="number"
          value={formState.number}
          placeholder='Numero di maglia'
          required
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      {!isFutsal && (
      <div className="form-group">
        <label htmlFor="role">Ruolo <span style={{ color: 'red' }}>*</span></label>
        <select
          id="role"
          name="role"
          value={formState.role}
          required
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="">Seleziona un ruolo</option>
          <option value="PORTIERE">Portiere</option>
          <option value="DIFENSORE">Difensore</option>
          <option value="CENTROCAMPISTA">Centrocampista</option>
          <option value="ATTACCANTE">Attaccante</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="second_role">Ruolo secondario</label>
        <select
          id="second_role"
          name="second_role"
          value={formState.second_role}
          onChange={handleInputChange}
          className="input-field"
        >
          <option value="">Seleziona un ruolo</option>
          <option value="PORTIERE">Portiere</option>
          <option value="DIFENSORE">Difensore</option>
          <option value="CENTROCAMPISTA">Centrocampista</option>
          <option value="ATTACCANTE">Attaccante</option>
        </select>
      </div>
    )}
      <div className="form-group">
        <label htmlFor="value">Valore <span style={{ color: 'red' }}>*</span></label>
        <input
          type="number"
          id="value"
          name="value"
          value={formState.value}
          placeholder='Valore'
          required
          onChange={handleInputChange}
          className="input-field"
        />
      </div>
      <div className="form-group form-group--left">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={formState.isActive}
          onChange={handleInputChange}
          style={{ marginRight: '8px' }}
        />
        <label className='is-active-label' htmlFor="isActive">Attivo</label>
      </div>
    </div>
  );
};

export default AddPlayerForm;
