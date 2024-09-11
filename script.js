// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "YOUR COHORT NAME HERE";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}`;

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    const response = await fetch(`${API_URL}/players`);
    const result = await response.json();
    return result.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${API_URL}/players/${playerId}`);
    const result = await response.json();
    return result.data.player;
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (playerObj) => {
  try {
    const response = await fetch(`${API_URL}/players`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(playerObj),
    });
    const result = await response.json();
    return result.data.newPlayer;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    await fetch(`${API_URL}/players/${playerId}`, {
      method: 'DELETE',
    });
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  // TODO
  const main = document.querySelector('main');
  main.innerHTML = '';

  if (playerList.length === 0) {
    main.innerHTML = '<p>No players available!</p>';
    return;
  }

  playerList.forEach(player => {
    const playerCard = document.createElement('div');
    playerCard.className = 'player-card';

    const playerImage = document.createElement('img');
    playerImage.src = player.imageUrl;
    playerImage.alt = player.name;

    const playerName = document.createElement('h2');
    playerName.innerText = player.name;

    const playerId = document.createElement('p');
    playerId.innerText = `ID: ${player.id}`;

    const seeDetailsButton = document.createElement('button');
    seeDetailsButton.innerText = 'See details';
    seeDetailsButton.addEventListener('click', async () => {
      const detailedPlayer = await fetchSinglePlayer(player.id);
      renderSinglePlayer(detailedPlayer);
    });

    const removeButton = document.createElement('button');
    removeButton.innerText = 'Remove from roster';
    removeButton.addEventListener('click', async () => {
      await removePlayer(player.id);
      const updatedPlayers = await fetchAllPlayers();
      renderAllPlayers(updatedPlayers);
    });

    playerCard.appendChild(playerImage);
    playerCard.appendChild(playerName);
    playerCard.appendChild(playerId);
    playerCard.appendChild(seeDetailsButton);
    playerCard.appendChild(removeButton);

    main.appendChild(playerCard);
  });
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  // TODO
  const main = document.querySelector('main');
  main.innerHTML = '';

  const playerCard = document.createElement('div');
  playerCard.className = 'player-card';

  const playerImage = document.createElement('img');
  playerImage.src = player.imageUrl;
  playerImage.alt = player.name;

  const playerName = document.createElement('h2');
  playerName.innerText = player.name;

  const playerId = document.createElement('p');
  playerId.innerText = `ID: ${player.id}`;

  const playerBreed = document.createElement('p');
  playerBreed.innerText = `Breed: ${player.breed}`;

  const playerTeam = document.createElement('p');
  playerTeam.innerText = `Team: ${player.team ? player.team.name : 'Unassigned'}`;

  const backButton = document.createElement('button');
  backButton.innerText = 'Back to all players';
  backButton.addEventListener('click', async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);
  });

  playerCard.appendChild(playerImage);
  playerCard.appendChild(playerName);
  playerCard.appendChild(playerId);
  playerCard.appendChild(playerBreed);
  playerCard.appendChild(playerTeam);
  playerCard.appendChild(backButton);

  main.appendChild(playerCard);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    const form = document.getElementById("new-player-form");

    // Create input elements for player details
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.id = "player-name";
    nameInput.placeholder = "Puppy Name";
    nameInput.required = true;

    const breedInput = document.createElement("input");
    breedInput.type = "text";
    breedInput.id = "player-breed";
    breedInput.placeholder = "Breed";
    breedInput.required = true;

    const imageUrlInput = document.createElement("input");
    imageUrlInput.type = "url";
    imageUrlInput.id = "player-image-url";
    imageUrlInput.placeholder = "Image URL";
    imageUrlInput.required = true;

    const statusSelect = document.createElement("select");
    statusSelect.id = "player-status";
    const optionBench = document.createElement("option");
    optionBench.value = "bench";
    optionBench.innerText = "Bench";
    const optionField = document.createElement("option");
    optionField.value = "field";
    optionField.innerText = "Field";
    statusSelect.appendChild(optionBench);
    statusSelect.appendChild(optionField);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerText = "Add Player";

    // Append all input elements to the form
    form.appendChild(nameInput);
    form.appendChild(breedInput);
    form.appendChild(imageUrlInput);
    form.appendChild(statusSelect);
    form.appendChild(submitButton);

    // Handle form submission
    form.addEventListener("submit", async (event) => {
      event.preventDefault(); // Prevent default form submission behavior

      const name = nameInput.value;
      const breed = breedInput.value;
      const imageUrl = imageUrlInput.value;
      const status = statusSelect.value;

      const playerObj = {
        name,
        breed,
        imageUrl,
        status,
      };

      // Add new player via API
      await addNewPlayer(playerObj);

      // Clear form fields after submission
      nameInput.value = "";
      breedInput.value = "";
      imageUrlInput.value = "";
      statusSelect.value = "bench";

      // Fetch and render all players
      const players = await fetchAllPlayers();
      renderAllPlayers(players);
    });
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
