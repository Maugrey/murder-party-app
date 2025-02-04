import React, { useState, useEffect } from 'react';
import DataService from '../services/dataService';
import './Timer.css'; // On peut créer un fichier CSS spécifique si besoin

/**
 * Timer component displays elapsed time and phase info in a single line:
 * "HH:MM:SS - Phase X HH:MM:SS"
 */
const Timer = () => {
  const [gameTime, setGameTime] = useState(0);
  const [phaseTime, setPhaseTime] = useState(0);
  const gameData = DataService.getGameData();
  const gameStarted = gameData.gameStarted;

  useEffect(() => {
    if (!gameStarted || !gameData.startTime || !gameData.phaseStartTime) {
      setGameTime(0);
      setPhaseTime(0);
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      setGameTime(now - gameData.startTime);
      setPhaseTime(now - gameData.phaseStartTime);
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStarted, gameData.startTime, gameData.phaseStartTime]);

  const formatTime = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer">
      <p>{formatTime(gameTime)} - Phase {gameData.currentPhase} {formatTime(phaseTime)}</p>
    </div>
  );
};

export default Timer;
