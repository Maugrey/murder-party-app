import React, { useState, useEffect } from 'react';
import DataService from '../services/dataService';

/**
 * Fouiller page allows searching a location and a specific place to reveal a clue.
 * If the clue is of type "objet", a button "Garder l’indice" lets the player take it.
 */
const Fouiller = () => {
  const [allClues, setAllClues] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [displayedClue, setDisplayedClue] = useState('');
  const [isTaken, setIsTaken] = useState(false);

  useEffect(() => {
    fetch('/fouiller_clues.json')
      .then((response) => response.json())
      .then((data) => {
        const gameData = DataService.getGameData();
        const currentPhase = gameData.currentPhase || 1;
        // Filtrer les indices disponibles en fonction de la phase et des conditions.
        const availableClues = data.filter((clue) => {
          if (clue.phase > currentPhase) return false;
          if (clue.condition && clue.condition !== "") {
            const [condName, condValue] = clue.condition.split('=');
            const expected = condValue === '1';
            return gameData.conditions[condName] === expected;
          }
          return true;
        });
        const uniqueLocations = Array.from(new Set(availableClues.map((clue) => clue.location)));
        setAllClues(data);
        setLocations(uniqueLocations);
      })
      .catch((error) => console.error('Error fetching fouiller clues:', error));
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const gameData = DataService.getGameData();
      const currentPhase = gameData.currentPhase || 1;
      const cluesForLocation = allClues.filter((clue) => {
        if (clue.location !== selectedLocation) return false;
        if (clue.phase > currentPhase) return false;
        if (clue.condition && clue.condition !== "") {
          const [condName, condValue] = clue.condition.split('=');
          const expected = condValue === '1';
          return gameData.conditions[condName] === expected;
        }
        return true;
      });
      const uniquePlaces = Array.from(new Set(cluesForLocation.map((clue) => clue.place)));
      setPlaces(uniquePlaces);
      setSelectedPlace('');
      setDisplayedClue('');
      setIsTaken(false);
    }
  }, [selectedLocation, allClues]);

  const handleSearch = () => {
    if (!selectedLocation || !selectedPlace) {
      alert('Veuillez sélectionner un lieu et un endroit à fouiller.');
      return;
    }
    // Si l'objet a déjà été pris, on affiche un message.
    if (DataService.isClueTaken(selectedLocation, selectedPlace)) {
      setDisplayedClue('Quelque chose ici a été enlevé.');
      setIsTaken(true);
      return;
    }
    // Chercher l’indice correspondant au couple lieu/endroit.
    const clueObj = allClues.find(
      (clue) => clue.location === selectedLocation && clue.place === selectedPlace
    );
    if (clueObj) {
      setDisplayedClue(clueObj.clue);
    } else {
      setDisplayedClue("Aucun indice trouvé pour cet endroit.");
    }
  };

  const handleKeepClue = () => {
    DataService.markClueAsTaken(selectedLocation, selectedPlace);
    setDisplayedClue('Quelque chose ici a été enlevé.');
    setIsTaken(true);
  };

  return (
    <div className="fouiller-page">
      <h2>Fouiller</h2>
      <div>
        <label>
          Choix du lieu :
          <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
            <option value="">--Sélectionnez un lieu--</option>
            {locations.map((loc, index) => (
              <option key={index} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Choix de l’endroit :
          <select
            value={selectedPlace}
            onChange={(e) => setSelectedPlace(e.target.value)}
            disabled={!selectedLocation}
          >
            <option value="">--Sélectionnez un endroit--</option>
            {places.map((place, index) => (
              <option key={index} value={place}>
                {place}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button onClick={handleSearch}>Fouiller</button>
      {displayedClue && (
        <div className="clue-display">
          <h3>Indice :</h3>
          <p>{displayedClue}</p>
          {!isTaken &&
            (() => {
              const clueObj = allClues.find(
                (clue) => clue.location === selectedLocation && clue.place === selectedPlace
              );
              if (clueObj && clueObj.type === 'objet' && !DataService.isClueTaken(selectedLocation, selectedPlace)) {
                return <button onClick={handleKeepClue}>Garder l’indice</button>;
              }
              return null;
            })()}
        </div>
      )}
    </div>
  );
};

export default Fouiller;
