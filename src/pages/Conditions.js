import React, { useState, useEffect } from 'react';
import DataService from '../services/dataService';
import './Conditions.css';


/**
 * Conditions page:
 * - Loads a list of conditions (name et description) from a JSON file.
 * - For each condition, displays a slider (checkbox) to toggle its activation.
 * - The value est stockée en localStorage (via DataService).
 */
const Conditions = () => {
  const [conditionsList, setConditionsList] = useState([]);
  const gameData = DataService.getGameData();

  useEffect(() => {
    fetch('/conditions.json')
      .then((response) => response.json())
      .then((data) => {
        // Pour chaque condition, on initialise la valeur à false si non présente
        const updatedConditions = { ...gameData.conditions };
        data.forEach((cond) => {
          if (updatedConditions[cond.name] === undefined) {
            updatedConditions[cond.name] = false;
          }
        });
        gameData.conditions = updatedConditions;
        DataService.saveGameData(gameData);
        setConditionsList(data);
      })
      .catch((error) => console.error('Error fetching conditions:', error));
  }, []);

  const toggleCondition = (condName) => {
    const newValue = !gameData.conditions[condName];
    DataService.setCondition(condName, newValue);
    // Forcer le rechargement en mettant à jour le state.
    setConditionsList([...conditionsList]);
  };

  return (
    <div className="conditions-page">
      <h2>Conditions</h2>
      {conditionsList.map((cond, index) => (
        <div key={index} className="condition-item">
          <p>
            <strong>{cond.name}</strong>: {cond.description}
          </p>
          <label className="switch">
            <input
              type="checkbox"
              checked={gameData.conditions[cond.name] || false}
              onChange={() => toggleCondition(cond.name)}
            />
            <span className="slider"></span>
          </label>
          <span className="switch-status">
            {gameData.conditions[cond.name] ? 'Activée' : 'Désactivée'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Conditions;
