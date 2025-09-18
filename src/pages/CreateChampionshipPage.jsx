import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import { createChampionship } from '../api/championships';
import ImageCropper from '../components/ImageCropper';
import { MAX_FILE_SIZE_MB } from '../utils/constants';

const sportTypes = [
  //{ value: 'CALCIO_5', label: 'Calcio a 5' },
  { value: 'CALCIO_7', label: 'Calcio a 7' },
  //{ value: 'CALCIO_11', label: 'Calcio a 11' },
];

const CreateChampionshipPage = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [championshipName, setChampionshipName] = useState('');
  const [championshipAlias, setChampionshipAlias] = useState('');
  const [loading, setLoading] = useState(false);
  const [championshipLogoFile, setChampionshipLogoFile] = useState(null);
  const [championshipLogoPreview, setChampionshipLogoPreview] = useState(null);
  const [sportType, setSportType] = useState('CALCIO_7');
  const [isDragActive, setIsDragActive] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [view, setView] = useState('form'); // 'form' o 'cropper'
  const navigate = useNavigate();

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`Il file selezionato è troppo grande. La dimensione massima consentita è ${MAX_FILE_SIZE_MB}MB.`);
      setChampionshipLogoFile(null);
      setChampionshipLogoPreview(null);
      return;
    }
    setErrorMessage('');
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop({ src: reader.result, name: file.name });
        setView('cropper');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = (file) => {
    setChampionshipLogoFile(file);
    setChampionshipLogoPreview(URL.createObjectURL(file));
    setView('form');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoChange({ target: { files: e.dataTransfer.files } });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleLogoClick = () => {
    document.getElementById('championship-logo-input').click();
  };

  const handleRemoveLogo = (e) => {
    e.stopPropagation();
    setChampionshipLogoFile(null);
    setChampionshipLogoPreview(null);
    document.getElementById('championship-logo-input').value = '';
  };

  const handleCreateChampionship = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    if (!championshipName) {
      setErrorMessage('Il nome del campionato è obbligatorio.');
      return;
    }
    if (!championshipLogoFile) {
      setErrorMessage('Il logo del campionato è obbligatorio.');
      return;
    }
    if (!sportType) {
      setErrorMessage('Seleziona la tipologia di sport.');
      return;
    }
    setLoading(true);
    try {
      const data = await createChampionship({
        name: championshipName,
        alias: championshipAlias,
        logoFile: championshipLogoFile,
        sport_type: sportType
      });
      navigate(`/championships/${data.id}/import-players`);
    } catch (error) {
      setErrorMessage(error.message || 'Errore durante la creazione del campionato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="central-box">
      <div className="add-players-container">
        <BackButton />
        <h2 className="title">{view === 'form' ? 'Crea un Nuovo Campionato' : 'Ritaglia Logo'}</h2>
        
        {view === 'form' ? (
          <form onSubmit={handleCreateChampionship} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div className="form-group">
              <label htmlFor="championship-name">Nome del Campionato</label>
              <input
                type="text"
                id="championship-name"
                value={championshipName}
                onChange={(e) => setChampionshipName(e.target.value)}
                className="input-field"
                placeholder="Inserisci il nome..."
                autoFocus
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="championship-alias">Alias Squadra (opzionale)</label>
              <input
                type="text"
                id="championship-alias"
                value={championshipAlias}
                onChange={(e) => setChampionshipAlias(e.target.value)}
                className="input-field"
                placeholder="Es. 'La mia squadra'"
              />
              <small style={{ color: '#666', marginTop: '4px' }}>Questo nome verrà usato come squadra di casa predefinita nel calendario.</small>
            </div>
            <div className="form-group">
              <label>Logo del Campionato</label>
              <div
                className={`player-photo-dropzone${isDragActive ? ' player-photo-dropzone--active' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleLogoClick}
                tabIndex={0}
                role="button"
                aria-label="Carica logo"
                style={{ marginBottom: '0.5rem', marginTop: '8px' }}
              >
                {championshipLogoPreview ? (
                  <>
                    <img src={championshipLogoPreview} alt="Logo Preview" className="player-photo-img" />
                    <button
                      type="button"
                      className="player-remove-photo-btn"
                      onClick={handleRemoveLogo}
                      aria-label="Rimuovi logo"
                    >
                      &times;
                    </button>
                  </>
                ) : (
                  <span>Carica Logo</span>
                )}
                <input
                  type="file"
                  id="championship-logo-input"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleLogoChange}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Tipologia di Sport</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '8px' }}>
                {sportTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    className={`button${sportType === type.value ? ' button-active' : ' button-not-active'}`}
                    onClick={() => setSportType(type.value)}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <button className="button save" type="submit" disabled={loading}>
              {loading ? 'Creazione...' : 'Crea Campionato'}
            </button>
          </form>
        ) : (
          <ImageCropper
            imageSrc={imageToCrop?.src}
            onCropComplete={handleCropComplete}
            onCancel={() => setView('form')}
          />
        )}
      </div>
    </div>
  );
};

export default CreateChampionshipPage;