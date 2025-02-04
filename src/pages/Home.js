import React from 'react';
import { useNavigate } from 'react-router-dom';
import DataService from '../services/dataService';

/**
 * Home page:
 * - If the game is not started: displays a START button.
 * - If the game has started: displays 4 action buttons.
 */
const Home = () => {
  const navigate = useNavigate();
  const gameData = DataService.getGameData();
  const gameStarted = gameData.gameStarted;

  const handleStart = () => {
    // Initialize game data
    gameData.gameStarted = true;
    gameData.startTime = Date.now();
    gameData.phaseStartTime = Date.now();
    gameData.currentPhase = 1;
    DataService.saveGameData(gameData);
    // Navigue vers l'accueil pour rafraîchir l'affichage
    navigate("/");
    window.location.reload();
  };

  if (!gameStarted) {
    return (
      <div className="home-page">
        <h2>Bienvenue à la Murder Party</h2>
        <button onClick={handleStart}>START</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h2>Actions</h2>
      <button onClick={() => navigate('/interroger')}>Interroger</button>
      <button onClick={() => navigate('/fouiller')}>Fouiller</button>
      <button onClick={() => navigate('/acheter')}>Acheter</button>
      <button onClick={() => navigate('/pensine')}>Pensine</button>
    </div>
  );
};

export default Home;
