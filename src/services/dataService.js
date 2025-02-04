const GAME_DATA_KEY = 'murderPartyGameData';

const DataService = {
  /**
   * Retrieves the game data from local storage.
   * If not present, returns the default object.
   */
  getGameData: () => {
    const data = localStorage.getItem(GAME_DATA_KEY);
    if (data) {
      return JSON.parse(data);
    }
    return {
      startTime: null,
      phaseStartTime: null,
      currentPhase: 1,
      gameStarted: false,
      conditions: {},
      seenClues: {},   // Structure: { "location|npc": [levels] }
      takenClues: {}   // Structure: { "location|place": true }
    };
  },

  /**
   * Saves the game data to local storage.
   * @param {Object} gameData
   */
  saveGameData: (gameData) => {
    localStorage.setItem(GAME_DATA_KEY, JSON.stringify(gameData));
  },

  /**
   * Resets the game data.
   */
  resetGameData: () => {
    localStorage.removeItem(GAME_DATA_KEY);
  },

  /**
   * Marks a clue (for Interroger) as seen for a given location, npc, and level.
   * @param {string} location
   * @param {string} npc
   * @param {number} level
   */
  markClueAsSeen: (location, npc, level) => {
    const gameData = DataService.getGameData();
    const key = `${location}|${npc}`;
    if (!gameData.seenClues[key]) {
      gameData.seenClues[key] = [];
    }
    if (!gameData.seenClues[key].includes(level)) {
      gameData.seenClues[key].push(level);
    }
    DataService.saveGameData(gameData);
  },

  /**
   * Retrieves the list of seen clue levels for a given location and npc.
   * @param {string} location
   * @param {string} npc
   * @returns {Array<number>}
   */
  getSeenClues: (location, npc) => {
    const gameData = DataService.getGameData();
    const key = `${location}|${npc}`;
    return gameData.seenClues[key] || [];
  },

  /**
   * Sets a condition value.
   * @param {string} conditionName
   * @param {boolean} value
   */
  setCondition: (conditionName, value) => {
    const gameData = DataService.getGameData();
    if (!gameData.conditions) {
      gameData.conditions = {};
    }
    gameData.conditions[conditionName] = value;
    DataService.saveGameData(gameData);
  },

  /**
   * Checks if a clue (for Fouiller) has already been taken.
   * @param {string} location
   * @param {string} place
   * @returns {boolean}
   */
  isClueTaken: (location, place) => {
    const gameData = DataService.getGameData();
    const key = `${location}|${place}`;
    return gameData.takenClues && gameData.takenClues[key] === true;
  },

  /**
   * Marks a clue (for Fouiller) as taken.
   * @param {string} location
   * @param {string} place
   */
  markClueAsTaken: (location, place) => {
    const gameData = DataService.getGameData();
    const key = `${location}|${place}`;
    if (!gameData.takenClues) {
      gameData.takenClues = {};
    }
    gameData.takenClues[key] = true;
    DataService.saveGameData(gameData);
  }
};

export default DataService;
