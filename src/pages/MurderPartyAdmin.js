import React from 'react';
import DataService from '../services/dataService';
import { useNavigate } from 'react-router-dom';

/**
 * MurderPartyAdmin page provides administrative controls:
 * - RESET: Resets game data (counters, phase, et statut de la partie)
 * - Phase Précédente / Suivante: Change the current phase and resets the phase timer.
 */
const MurderPartyAdmin = () => {
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser la partie ?")) {
      DataService.resetGameData();
      navigate("/");
      window.location.reload();
    }
  };

  const handleNextPhase = () => {
    const gameData = DataService.getGameData();
    gameData.currentPhase = gameData.currentPhase + 1;
    gameData.phaseStartTime = Date.now();
    DataService.saveGameData(gameData);
    window.location.reload();
  };

  const handlePreviousPhase = () => {
    const gameData = DataService.getGameData();
    if (gameData.currentPhase > 1) {
      gameData.currentPhase = gameData.currentPhase - 1;
      gameData.phaseStartTime = Date.now();
      DataService.saveGameData(gameData);
      window.location.reload();
    } else {
      alert("La phase ne peut pas être inférieure à 1.");
    }
  };

  return (
    <div className="admin-page">
      <h2>Murder Party Admin</h2>
      <button onClick={handleReset}>RESET</button>
      <button onClick={handlePreviousPhase}>Phase Précédente</button>
      <button onClick={handleNextPhase}>Phase Suivante</button>
    </div>
  );
};

export default MurderPartyAdmin;
