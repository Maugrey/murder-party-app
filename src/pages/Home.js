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
    // Fetch the conditions from conditions.json using promises
    fetch('/conditions.json')
      .then((response) => response.json())
      .then((conditionsFromJson) => {
        // Create an object mapping each condition name to false.
        const conditionsObject = {};
        conditionsFromJson.forEach((cond) => {
          conditionsObject[cond.name] = false;
        });

        // Initialize game data
        gameData.gameStarted = true;
        gameData.startTime = Date.now();
        gameData.phaseStartTime = Date.now();
        gameData.currentPhase = 1;
        gameData.conditions = conditionsObject; // Initialiser toutes les conditions à false.
        DataService.saveGameData(gameData);

        // Naviguer vers la page d'accueil et recharger pour actualiser l'affichage
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error initializing conditions:", error);
      });
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
