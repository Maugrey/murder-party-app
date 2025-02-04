import React, { useState, useEffect } from 'react';
import DataService from '../services/dataService';

/**
 * Interroger page allows the Game Master to interrogate NPCs and retrieve clues.
 */
const Interroger = () => {
  const [allClues, setAllClues] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [npcs, setNpcs] = useState([]);
  const [selectedNpc, setSelectedNpc] = useState('');
  const [displayedClue, setDisplayedClue] = useState('');
  const [alreadySeen, setAlreadySeen] = useState(false);

  useEffect(() => {
    fetch('/clues.json')
      .then((response) => response.json())
      .then((data) => {
        const gameData = DataService.getGameData();
        const currentPhase = gameData.currentPhase || 1;
        // Pour la liste des lieux, on ne garde que ceux pour lesquels il existe au moins un indice disponible.
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
      .catch((error) => console.error('Error fetching clues:', error));
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      const gameData = DataService.getGameData();
      const currentPhase = gameData.currentPhase || 1;
      // Pour le lieu sélectionné, on récupère les indices disponibles.
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
      const uniqueNpcs = Array.from(new Set(cluesForLocation.map((clue) => clue.npc)));
      setNpcs(uniqueNpcs);
      setSelectedNpc('');
      setDisplayedClue('');
      setAlreadySeen(false);
    }
  }, [selectedLocation, allClues]);

  const handleInterrogate = () => {
    if (!selectedLocation || !selectedNpc) {
      alert('Veuillez sélectionner un lieu et un PNJ.');
      return;
    }
    const gameData = DataService.getGameData();
    const currentPhase = gameData.currentPhase || 1;
    const conditions = gameData.conditions || {};

    // Filtrer les indices pour le couple lieu/PNJ choisis.
    let availableClues = allClues.filter((clue) => {
      if (clue.location !== selectedLocation || clue.npc !== selectedNpc) return false;
      if (clue.phase > currentPhase) return false;
      if (clue.condition && clue.condition !== "") {
        const [condName, condValue] = clue.condition.split('=');
        const expected = condValue === '1';
        return conditions[condName] === expected;
      }
      return true;
    });

    if (availableClues.length === 0) {
      setDisplayedClue("Aucun indice disponible pour ce PNJ à ce moment.");
      return;
    }

    // Trier les indices par niveau croissant.
    availableClues.sort((a, b) => a.level - b.level);

    // Récupérer les niveaux déjà vus pour ce couple.
    const seenLevels = DataService.getSeenClues(selectedLocation, selectedNpc);
    let clueToShow = availableClues.find((clue) => !seenLevels.includes(clue.level));
    if (!clueToShow) {
      // Si tous les niveaux ont été vus, afficher le dernier indice.
      clueToShow = availableClues[availableClues.length - 1];
      setAlreadySeen(true);
    } else {
      setAlreadySeen(false);
    }

    // Marquer ce niveau comme vu.
    DataService.markClueAsSeen(selectedLocation, selectedNpc, clueToShow.level);
    setDisplayedClue(clueToShow.clue);
  };

  return (
    <div className="interroger-page">
      <h2>Interroger</h2>
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
          Choix du PNJ :
          <select
            value={selectedNpc}
            onChange={(e) => setSelectedNpc(e.target.value)}
            disabled={!selectedLocation}
          >
            <option value="">--Sélectionnez un PNJ--</option>
            {npcs.map((npc, index) => (
              <option key={index} value={npc}>
                {npc}
              </option>
            ))}
          </select>
        </label>
      </div>
      <button onClick={handleInterrogate}>Interroger</button>
      {displayedClue && (
        <div className="clue-display">
          <h3>Indice :</h3>
          <p>{displayedClue} {alreadySeen && <em>(déjà vu)</em>}</p>
        </div>
      )}
    </div>
  );
};

export default Interroger;
