import React from 'react';
import { Navigate } from 'react-router-dom';
import DataService from '../services/dataService';

/**
 * ProtectedRoute checks if the game has started.
 * If not, it redirects to the home page.
 */
const ProtectedRoute = ({ children }) => {
  const gameData = DataService.getGameData();
  if (!gameData.gameStarted) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
