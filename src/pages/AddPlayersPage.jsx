import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/Modal';
import { fetchChampionshipDetails } from '../api/championships';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import AddPlayerForm from '../components/AddPlayerForm';
import BackButton from '../components/BackButton';
import ImageCropper from '../components/ImageCropper';
import { faCropAlt } from '@fortawesome/free-solid-svg-icons';
import { fetchChangeChampionshipProps } from '../api/championships';
import { fetchPlayers, addPlayer, updatePlayer, deletePlayer as apiDeletePlayer } from '../api/players';
import { getRoleIcon } from '../utils/icons';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';
import { MAX_FILE_SIZE_MB } from '../utils/constants';
const initialFormState = {
  name: '',
  photoFile: null,
  photoPreview: null,
  isImageSaved: false,
  number: '',
  role: '',
  second_role: '',
  value: '',
  isActive: true,
};

const AddPlayersPage = () => {
  const { championshipId } = useParams();
  const navigate = useNavigate();
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [championshipBudget, setChampionshipBudget] = useState(1000);
  const [confirmCreate, setConfirmCreate] = useState(false);
  const [championshipName, setChampionshipName] = useState('');
  const [championshipType, setChampionshipType] = useState('CALCIO_7');
  const [championshipStatus, setChampionshipStatus] = useState('00');
  const [notEnoughPlayers, setNotEnoughPlayers] = useState(false);
  const [formState, setFormState] = useState(initialFormState);
  const [fileSizeError, setFileSizeError] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);
  const [photoRequiredError, setPhotoRequiredError] = useState(false);
  const [loading, setLoading] = useState(true);
  // Stati per il cropper integrato
  const [imageToCrop, setImageToCrop] = useState(null);
  const [modalView, setModalView] = useState('form'); // 'form' o 'cropper'
  const [isFutsal,setIsFutsal] = useState(false)
  useEffect(() => {
    const loadChampionshipName = async () => {
      try {
        const details = await fetchChampionshipDetails(championshipId);
        setChampionshipName(details.name);
        setChampionshipType(details.sport_type);
        setIsFutsal(details.sport_type === 'CALCIO_5');
        setChampionshipStatus(details.status);
        setChampionshipBudget(details.budget_per_user || 1000);
      } catch (error) {
        console.error("Errore nel caricamento del nome del campionato:", error);
      }
    };
    loadChampionshipName();
  }, [championshipId]);

  const getMinPlayers = (type) => {
    switch (type) {
      case 'CALCIO_5': return 5;
      case 'CALCIO_7': return 7;
      case 'CALCIO_11': return 11;
      default: return 1;
    }
  };

  const minPlayers = getMinPlayers(championshipType);

  useEffect(() => {
    const getPlayers = async () => {
      try {
        setLoading(true);
        const data = await fetchPlayers(championshipId);
        setPlayers(data);
        setNotEnoughPlayers(data.length < minPlayers);
      } catch (error) {
        console.error("Errore nel caricamento dei giocatori:", error);
      } finally {
        setLoading(false);
      }
    };
    getPlayers();
  }, [championshipId]);

  const handleAddPlayer = async (newPlayer) => {
    try {
      const createdPlayer = await addPlayer(championshipId, newPlayer);
      setPlayers(prevPlayers => [...prevPlayers, createdPlayer].sort((a, b) => a.id - b.id));
      setShowAddPlayerModal(false);
      setNotEnoughPlayers(players.length + 1 < minPlayers);
    } catch (error) {
      console.error("Errore durante la creazione del giocatore:", error);
      // Qui potresti voler mostrare un messaggio di errore all'utente
    }
  };

  const handleCreateChampionship = () => {
    setConfirmCreate(true);
  };

  const handleUpdatePlayer = async (updatedPlayer) => {
    try {
      const returnedPlayer = await updatePlayer(championshipId, updatedPlayer.id, updatedPlayer);
      setPlayers(prevPlayers => prevPlayers.map(p => p.id === returnedPlayer.id ? returnedPlayer : p));
      setShowAddPlayerModal(false);
    } catch (error) {
      console.error("Errore durante la modifica del giocatore:", error);
      // Qui potresti voler mostrare un messaggio di errore all'utente
    }
  }
  
  const handleDeletePlayer = async (player) => {
    try {
      await apiDeletePlayer(championshipId, player.id);
      setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== player.id));
      setShowAddPlayerModal(false);
    } catch (error) {
      console.error("Errore durante l'eliminazione del giocatore:", error);
    }
  };

  const confirmCreation = async () => {
    setConfirmCreate(false);
    let newStatus = '';
    if (championshipStatus === '00') newStatus = '20';

    // Assicura che il budget sia un numero prima di inviarlo
    const budgetAsNumber = parseFloat(championshipBudget);

    const response = await fetchChangeChampionshipProps(championshipId, budgetAsNumber, newStatus);
    if (!response.ok) {
      console.error('Errore durante la creazione/modifica del campionato:', response.statusText);
      return;
    }
    navigate(`/championships/${championshipId}/dashboard`);
  };

  const cancelCreation = () => {
    setConfirmCreate(false);
  };

  // Gestione campi form quando si apre il modal
  useEffect(() => {
    if (showAddPlayerModal) {
      if (selectedPlayer) {
        setFormState({
          name: selectedPlayer.name || '',
          photoFile: null,
          photoPreview: selectedPlayer.photo_url || null,
          isImageSaved: !!selectedPlayer.photo_url,
          number: selectedPlayer.number || '',
          role: selectedPlayer.role || '',
          second_role: selectedPlayer.second_role || '',
          value: selectedPlayer.initial_value || '',
          isActive: selectedPlayer.is_active ?? true,
        });
        setFileSizeError(false);
        setIsDragActive(false);
      } else {
        setFormState(initialFormState);
        setFileSizeError(false);
        setIsDragActive(false);
      }
    }
  }, [showAddPlayerModal, selectedPlayer]);

  // Gestione foto
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setFileSizeError(false);
    if (file) {
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        setFileSizeError(true);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageToCrop({ src: reader.result, name: file.name }); // Salva l'immagine da ritagliare
        setModalView('cropper'); // Cambia la vista del modale
      };
      reader.readAsDataURL(file);
    } else {
      setFormState(prev => ({ ...prev, photoFile: null, photoPreview: null }));
    }
  };

  const handleCropComplete = (croppedFile) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormState(prev => ({ ...prev, photoFile: croppedFile, photoPreview: reader.result, isImageSaved: false }));
    };
    reader.readAsDataURL(croppedFile);
    setModalView('form');
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoChange({ target: { files: e.dataTransfer.files } });
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

  const handlePhotoClick = () => {
    document.getElementById('player-photo-input').click();
  };

  const handleRemovePhoto = (e) => {
    e.stopPropagation();
    setFormState(prev => ({ ...prev, photoFile: null, photoPreview: null, isImageSaved: false }));
    setFileSizeError(false);
    document.getElementById('player-photo-input').value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formState.photoPreview) {
      setPhotoRequiredError(true);
      return;
    }
    setPhotoRequiredError(false);
    if (formState.photoFile && formState.photoFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileSizeError(true);
      return;
    }
    const newPlayer = {
      ...formState,
      photo: formState.photoFile,
    };
    if (selectedPlayer) {
      await handleUpdatePlayer({ ...selectedPlayer, ...newPlayer });
    } else {
      await handleAddPlayer(newPlayer);
    }
  };

  const deletePlayer = async () => {
    if (selectedPlayer && window.confirm('Sei sicuro di voler eliminare questo giocatore?')) {
      await handleDeletePlayer(selectedPlayer);
    }
  };

  return (
    <div className="central-box">
      <div className="add-players-container">
        <BackButton />
        <h2 className="title">{championshipName}</h2>
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Caricamento giocatori...</p>
        </div>
      ) : (
        <>
          <div className="players-container">
            {players.map((player, index) => (
              <div key={index} className="player-item">
                <div
                  className="player-circle"
                  onClick={() => {
                    setSelectedPlayer(player);
                    setShowAddPlayerModal(true);
                  }}
                  style={player.photo_url ? {
                      backgroundImage: `url(${player.photo_url.replace(/^app\//, '')})`,
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                  } : {}} 
                >
                  {!player.photo_url && (
                      <div className="player-placeholder">
                          {/* Mantieni il placeholder esistente */}
                          <FontAwesomeIcon icon={faUser} size="2x" />
                      </div>
                  )}
                  {!player.is_active && (
                    <div className="disabled-overlay"></div>
                  )}
                  { !isFutsal && (
                  <div className="role-label">
                    <FontAwesomeIcon icon={getRoleIcon(player.role)} />
                  </div>
                  )}
                  <div className="value-label">
                    {player.initial_value}
                  </div>
                </div>
                <div className="player-label">
                  <span>{player.name}</span>
                </div>
              </div>
            ))}
            <button className="add-player-button button" onClick={() => {
              setSelectedPlayer(null);
              setShowAddPlayerModal(true);
            }}>
              <FontAwesomeIcon icon={faPlus} />
            </button>
          </div>
          <div className="budget-input-container">
            <label htmlFor="budget">Budget del campionato:</label>
            <input
              type="number"
              id="budget"
              value={championshipBudget}
              onChange={(e) => setChampionshipBudget(e.target.value)}
              className="input-field"
            />
          </div>
          {championshipStatus !== '50' && championshipStatus !== '100' && (
            <button
              className="create-championship-button button"
              onClick={handleCreateChampionship}
              disabled={notEnoughPlayers}
              title={notEnoughPlayers ? `Non puoi creare il campionato con meno di ${minPlayers} giocatori.` : ''}
            >
              Crea/Modifica Campionato
            </button>
          )}
        </>
      )}
      </div>
      <Modal
        show={showAddPlayerModal} 
        onClose={() => {
          setShowAddPlayerModal(false);
          setModalView('form'); // Resetta la vista quando si chiude
        }}
        title={modalView === 'form' ? (selectedPlayer ? 'Modifica Giocatore' : 'Crea Giocatore') : 'Ritaglia Immagine'}
        icon={<FontAwesomeIcon icon={modalView === 'form' ? faUser : faCropAlt} />}
        actions={{
          onSubmit: modalView === 'form' ? handleSubmit : (e) => e.preventDefault(),
          buttons: (
            modalView === 'form' ? (
              <>
                <button type="submit" className="button save">
                  {selectedPlayer ? 'Modifica Giocatore' : 'Crea Giocatore'}
                </button>
                {(selectedPlayer && parseInt(championshipStatus) < 50) && (
                  <button type="button" className="button delete" onClick={deletePlayer}>
                    Elimina Giocatore
                  </button>
                )}
                <button type="button" className="button cancel" onClick={() => { setShowAddPlayerModal(false); setModalView('form'); }}>
                  Annulla
                </button>
              </>
            ) : null
          ),
        }}
      >
        {modalView === 'form' ? (
          <AddPlayerForm
            player={selectedPlayer}
            formState={formState} setFormState={setFormState}
            fileSizeError={fileSizeError} setFileSizeError={setFileSizeError}
            isDragActive={isDragActive} setIsDragActive={setIsDragActive}
            handlePhotoChange={handlePhotoChange}
            handleDrop={handleDrop}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            handlePhotoClick={handlePhotoClick}
            handleRemovePhoto={handleRemovePhoto}
            photoRequiredError={photoRequiredError}
            isFutsal={isFutsal}
          />
        ) : (
          <ImageCropper
            imageSrc={imageToCrop?.src}
            onCropComplete={handleCropComplete}
            onCancel={() => setModalView('form')}
          />
        )}
      </Modal>
      <Modal
        show={confirmCreate}
        onClose={() => setConfirmCreate(false)}
        title="Conferma creazione/modifica campionato"
        icon={<FontAwesomeIcon icon={faShieldAlt} />}
        actions={{
          buttons: (
            <>
              <button type="button" className="button save" onClick={confirmCreation}>
                Conferma
              </button>
              <button type="button" className="button cancel" onClick={cancelCreation}>
                Annulla
              </button>
            </>
          ),
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <p>Sei sicuro/a di voler creare/modificare il campionato con questi giocatori e questo budget?</p>
        </div>
      </Modal>
    </div>
  );
};

export default AddPlayersPage;
