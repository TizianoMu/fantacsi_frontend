import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFutbol, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import BackButton from '../components/BackButton';
import Modal from '../components/Modal';
import { fetchChampionships, clonePlayersFromChampionship } from '../api/championships';

const ImportPlayersPage = () => {
  const navigate = useNavigate();
  const { championshipId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [championships, setChampionships] = useState([]);
  const [selectedChampionship, setSelectedChampionship] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (showModal) {
      setError('');
      fetchChampionships(championshipId)
        .then(setChampionships)
        .catch(() => setError('Errore nel caricamento dei campionati.'));
    }
  }, [showModal, championshipId]);

  const handleImport = async (e) => {
    e.preventDefault();
    if (!selectedChampionship) return;
    setLoading(true);
    setError('');
    try {
      await clonePlayersFromChampionship(selectedChampionship, championshipId);
      navigate(`/championships/${championshipId}/add-players`); //Redirige alla pagina di aggiunta giocatori dopo averli importati
    } catch (err) {
      setError('Errore durante l\'importazione dei giocatori.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualAdd = () => {
    navigate(`/championships/${championshipId}/add-players`);
  };

  const modalActions = {
    onSubmit: handleImport,
    buttons: (
      <button
        type="submit"
        className="button save"
        disabled={!selectedChampionship || loading}
      >
        {loading ? 'Importazione...' : 'Importa'}
      </button>
    )
  };

  return (
    <div className="central-box">
      <div className="add-players-container">
        <BackButton />
        <h2 className="title">Come vuoi aggiungere i giocatori?</h2>
        <div className="import-players-actions" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.2rem' }}>
          <button className="button" onClick={() => setShowModal(true)}>
            Importa giocatori da campionato esistente
          </button>
          <button className="button" onClick={handleManualAdd}>
            Inserisci i tuoi giocatori manualmente
          </button>
        </div>
      </div>

      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        title="Seleziona un campionato da cui importare"
        icon={<FontAwesomeIcon icon={faFutbol} />}
        actions={modalActions}
      >
        <div style={{ padding: '0 0.5rem', maxHeight: '30vh', overflowY: 'auto' }}>
          {error && <p className="error-message">{error}</p>}
          {championships.length === 0 && !loading && (
            <p className="no-items-message">Nessun campionato trovato.</p>
          )}
          <div className="form-group" style={{ marginBottom: 0 }}>
            {championships.map(c => (
              <label key={c.id} className="championship-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                marginBottom: '0.5rem',
                border: selectedChampionship === c.id ? '2px solid var(--primary-color)' : '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'border-color 0.2s'
              }}>
                <input
                  type="radio"
                  name="championship"
                  value={c.id}
                  checked={selectedChampionship === c.id}
                  onChange={() => setSelectedChampionship(c.id)}
                  style={{ accentColor: 'var(--primary-color)' }}
                />
                <span className="championship-name" style={{ fontWeight: 'bold' }}>{c.name}</span>
              </label>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ImportPlayersPage;