// src/pages/Interroger.js

import React, { useState, useEffect } from 'react';
import DataService from '../services/dataService';

/**
 * Interroger page allows the Game Master to interrogate NPCs and retrieve clues.
 * 
 * Functionality:
 * - User selects a location and then a PNJ.
 * - Only available clues (according to phase and conditions) are considered.
 * - For a given couple (location/PNJ), clues are organized in levels (starting at level 1).
 * - On the first interrogation, the level 1 clue is shown; on subsequent clicks, the next level is shown.
 * - When all levels have been seen for that couple, the highest level clue is shown.
 * - The "Déjà vu" message is displayed only when the couple is re-sélectionné (i.e. si aucun indice n'est affiché)
 *   et que la totalité des niveaux disponibles a été consultée.
 * - When the location or PNJ selection changes, any displayed clue is cleared.
 */
const Interroger = () => {
  const [allClues, setAllClues] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [npcs, setNpcs] = useState([]);
  const [selectedNpc, setSelectedNpc] = useState('');
  const [displayedClue, setDisplayedClue] = useState('');
  const [alreadySeen, setAlreadySeen] = useState(false);

  // Load all clues from clues.json and build the list of available locations.
  useEffect(() => {
    fetch('/clues.json')
      .then((response) => response.json())
      .then((data) => {
        const gameData = DataService.getGameData();
        const currentPhase = gameData.currentPhase || 1;

        // Filter clues: only those with phase <= currentPhase and satisfying conditions.
        const availableClues = data.filter((clue) => {
          if (clue.phase > currentPhase) return false;
          if (clue.condition && clue.condition !== "") {
            const [condName, condValue] = clue.condition.split('=');
            const expected = condValue === '1';
            return gameData.conditions[condName] === expected;
          }
          return true;
        });

        // Build a list of locations for which there is au moins un indice disponible.
        const uniqueLocations = Array.from(new Set(availableClues.map((clue) => clue.location)));
        setAllClues(data);
        setLocations(uniqueLocations);
      })
      .catch((error) => console.error("Error fetching clues:", error));
  }, []);

  // Update the list of NPCs whenever the selected location changes.
  useEffect(() => {
    if (selectedLocation) {
      const gameData = DataService.getGameData();
      const currentPhase = gameData.currentPhase || 1;

      // Filter clues available for the selected location.
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

      // Extract the unique list of NPCs available for that location.
      const uniqueNpcs = Array.from(new Set(cluesForLocation.map((clue) => clue.npc)));
      setNpcs(uniqueNpcs);
      // Reset selection and displayed clue
      setSelectedNpc('');
      setDisplayedClue('');
      setAlreadySeen(false);
    } else {
      setNpcs([]);
      setSelectedNpc('');
      setDisplayedClue('');
      setAlreadySeen(false);
    }
  }, [selectedLocation, allClues]);

  // When the PNJ is selected (and a location est sélectionné),
  // on vérifie si le couple (lieu/PNJ) a vu la totalité des niveaux disponibles.
  // Cet effet s'exécute lors d'une re-sélection, ce qui permettra d'afficher "Déjà vu"
  // uniquement si aucun indice n'est actuellement affiché.
  useEffect(() => {
    if (selectedLocation) {
      // Dès qu'on sélectionne un couple, on efface l'indice affiché.
      setDisplayedClue('');
      
      const gameData = DataService.getGameData();
      const currentPhase = gameData.currentPhase || 1;
      const conditions = gameData.conditions || {};

      // Filter clues available for the couple.
      const availableForCouple = allClues.filter((clue) => {
        if (clue.location !== selectedLocation || clue.npc !== selectedNpc) return false;
        /*if (clue.phase > currentPhase) return false;
        if (clue.condition && clue.condition !== "") {
          const [condName, condValue] = clue.condition.split('=');
          const expected = condValue === '1';
          return conditions[condName] === expected;
        }*/
        return true;
      });

      const seenLevels = DataService.getSeenClues(selectedLocation, selectedNpc);
      // On considère le couple comme "vu" uniquement si tous les niveaux disponibles ont été vus.
      if (availableForCouple.length > 0 && seenLevels.length === availableForCouple.length) {
        setAlreadySeen(true);
      } else {
        setAlreadySeen(false);
      }
    }
  }, [selectedNpc, selectedLocation, allClues]);

  // Lors du clic sur "Interroger", on détermine quel indice (niveau) afficher.
  const handleInterrogate = () => {
    if (!selectedLocation || !selectedNpc) {
      alert("Veuillez sélectionner un lieu et un PNJ.");
      return;
    }

    const gameData = DataService.getGameData();
    const currentPhase = gameData.currentPhase || 1;
    const conditions = gameData.conditions || {};

    // Filter clues for the couple (selectedLocation, selectedNpc).
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

    // Trier les indices par ordre croissant de niveau.
    availableClues.sort((a, b) => a.level - b.level);

    // Récupérer les niveaux déjà vus pour ce couple.
    const seenLevels = DataService.getSeenClues(selectedLocation, selectedNpc);
    let clueToShow;

    if (seenLevels.length < availableClues.length) {
      // Sélectionner le premier niveau qui n'a pas encore été vu.
      clueToShow = availableClues.find((clue) => !seenLevels.includes(clue.level));
    } else {
      // Tous les niveaux ont été vus, afficher le dernier indice.
      clueToShow = availableClues[availableClues.length - 1];
    }

    // S'il s'agit d'un nouveau niveau, le marquer comme vu.
    if (!seenLevels.includes(clueToShow.level)) {
      DataService.markClueAsSeen(selectedLocation, selectedNpc, clueToShow.level);
    }

    // Afficher l'indice.
    setDisplayedClue(clueToShow.clue);

    // Ne pas afficher "Déjà vu" immédiatement après le clic (puisque l'indice est affiché).
    //setAlreadySeen(false);
  };

  return (
    <div className="interroger-page">
      <h2>Interroger</h2>
      <div>
        <label>
          Choix du lieu :
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
          >
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
        {/* Affichage de "Déjà vu" uniquement si le couple a vu tous les niveaux
            et qu'aucun indice n'est actuellement affiché (c'est-à-dire lors d'une re-sélection). */}
        {selectedNpc && alreadySeen && (
          <p style={{ color: 'red', fontWeight: 'bold' }}>Déjà vu</p>
        )}
      </div>
      <button onClick={handleInterrogate}>Interroger</button>
      {displayedClue && (
        <div className="clue-display">
          <h3>Indice :</h3>
          <p>{displayedClue}</p>
        </div>
      )}
    </div>
  );
};

export default Interroger;
