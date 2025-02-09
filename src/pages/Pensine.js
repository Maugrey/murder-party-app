import React, { useState, useEffect } from 'react';
import DataService from '../services/dataService';
import './Pensine.css';

// Composant auxiliaire qui prend un texte et le découpe en lettres
// Chaque lettre est enveloppée dans un <span> qui reçoit un délai d'animation basé sur son index.
const SlidingText = ({ text, delayOffset = 0 }) => {
  return (
    <span className="sliding-text">
      {text.split('').map((letter, index) => (
        <span key={index} style={{ animationDelay: `${delayOffset + index * 0.02}s` }}>
          {letter}
        </span>
      ))}
    </span>
  );
};

const Pensine = () => {
  const [memories, setMemories] = useState([]);       // Liste complète des souvenirs depuis pensine.json
  const [drawnIds, setDrawnIds] = useState([]);         // Liste des IDs déjà tirés, synchronisée avec gameData.drawnPensine
  const [currentMemory, setCurrentMemory] = useState(null);
  const [pensineEmpty, setPensineEmpty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [animationKey, setAnimationKey] = useState(0);  // Clé pour forcer le re-montage (pour relancer l'animation)

  // Récupérer la liste des souvenirs depuis pensine.json et ajouter un id à chacun.
  useEffect(() => {
    fetch('/pensine.json')
      .then((res) => res.json())
      .then((data) => {
        const memoriesWithId = data.map((mem, index) => ({ ...mem, id: index }));
        setMemories(memoriesWithId);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching pensine.json:", error);
        setLoading(false);
      });
  }, []);

  // Charger la liste des IDs déjà tirés depuis gameData (via DataService).
  useEffect(() => {
    const gameData = DataService.getGameData();
    setDrawnIds(gameData.drawnPensine || []);
  }, []);

  // Fonction pour mettre à jour drawnIds et l'enregistrer dans gameData.
  const updateDrawnIds = (newDrawnIds) => {
    setDrawnIds(newDrawnIds);
    const gameData = DataService.getGameData();
    gameData.drawnPensine = newDrawnIds;
    DataService.saveGameData(gameData);
  };

  // Vérifier dès l'affichage si la pensine est vide.
  useEffect(() => {
    const gameData = DataService.getGameData();
    const currentPhase = gameData.currentPhase || 1;
    let availableMemories = memories.filter(
      (mem) => mem.phase <= currentPhase && !drawnIds.includes(mem.id)
    );
    if (currentPhase >= 5) {
      availableMemories = availableMemories.filter((mem) => mem.type === 'clue');
    }
    setPensineEmpty(availableMemories.length === 0);
  }, [memories, drawnIds]);

  // Fonction déclenchée lors du clic sur "Plonger dans la pensine"
  const handlePlonger = () => {
    const gameData = DataService.getGameData();
    const currentPhase = gameData.currentPhase || 1;
    const conditions = gameData.conditions || {};

    let availableMemories = memories.filter(
      (mem) => mem.phase <= currentPhase && !drawnIds.includes(mem.id)
    );
    if (currentPhase >= 5) {
      availableMemories = availableMemories.filter((mem) => mem.type === 'clue');
    }
    if (availableMemories.length === 0) {
      setCurrentMemory(null);
      return;
    }

    // Déterminer le type souhaité selon la phase.
    let desiredType = null;
    const r = Math.random();
    if (currentPhase <= 3) {
      if (r < 1 / 3) desiredType = 'useless';
      else if (r < 2 / 3) desiredType = 'false-lead';
      else desiredType = 'clue';
    } else if (currentPhase === 4) {
      if (r < 1 / 9) desiredType = 'useless';
      else if (r < (1 / 9 + 2 / 9)) desiredType = 'false-lead';
      else desiredType = 'clue';
    } else {
      desiredType = 'clue';
    }

    let pool = availableMemories.filter((mem) => mem.type === desiredType);
    if (pool.length === 0) {
      pool = availableMemories;
    }
    const randomIndex = Math.floor(Math.random() * pool.length);
    const drawnMemory = pool[randomIndex];

    updateDrawnIds([...drawnIds, drawnMemory.id]);
    setCurrentMemory(drawnMemory);
    // Incrémente la clé pour forcer le re-montage et relancer l'animation.
    setAnimationKey(prev => prev + 1);
  };

  return (
    <div className="pensine-page">
      <h2>Pensine</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <>
          {pensineEmpty ? (
            <p className="empty-message">La pensine du professeur Reeves est vide.</p>
          ) : (
            <>
              <button onClick={handlePlonger}>Plonger dans la pensine</button>
              {currentMemory && (
                <div key={animationKey}>
                  {/* Chaque ligne est affichée à l'aide du composant SlidingText.
                      On peut ajuster le delayOffset pour obtenir un effet en cascade. */}
                  <p><strong>Lieu :</strong> {currentMemory.location}</p>
                  <p><SlidingText text={currentMemory.memory} /></p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Pensine;
