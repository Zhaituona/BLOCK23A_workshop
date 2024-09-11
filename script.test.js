const {
  fetchAllPlayers,
  fetchSinglePlayer,
  addNewPlayer,
  removePlayer,
  renderAllPlayers,
  renderSinglePlayer,
  renderNewPlayerForm,
} = require("./script");

describe("fetchAllPlayers", () => {
  // Make the API call once before all the tests run
  let players;
  beforeAll(async () => {
    players = await fetchAllPlayers();
  });

  test("returns an array", () => {
    expect(Array.isArray(players)).toBe(true);
  });

  test("returns players with name and id", () => {
    players.forEach((player) => {
      expect(player).toHaveProperty("name");
      expect(player).toHaveProperty("id");
    });
  });
});

describe("fetchSinglePlayer", () => {
  // Assuming there is at least one player available in the API
  let singlePlayer;
  beforeAll(async () => {
    const players = await fetchAllPlayers();
    if (players.length > 0) {
      singlePlayer = await fetchSinglePlayer(players[0].id);
    }
  });

  test("fetches a single player by ID", () => {
    expect(singlePlayer).toHaveProperty("name");
    expect(singlePlayer).toHaveProperty("id");
    expect(singlePlayer).toHaveProperty("breed");
  });

  test("returns player with correct ID", async () => {
    const players = await fetchAllPlayers();
    const playerToTest = players[0];
    const fetchedPlayer = await fetchSinglePlayer(playerToTest.id);
    expect(fetchedPlayer.id).toBe(playerToTest.id);
  });
});

describe("addNewPlayer", () => {
  const newPlayerData = {
    name: "Test Puppy",
    breed: "Test Breed",
    status: "bench",
    imageUrl: "https://learndotresources.s3.amazonaws.com/workshop/60ad725bbe74cd0004a6cba0/puppybowl-default-dog.png",
  };

  let newPlayer;

  beforeAll(async () => {
    newPlayer = await addNewPlayer(newPlayerData);
  });

  test("adds a new player and returns the player object", () => {
    expect(newPlayer).toHaveProperty("name", newPlayerData.name);
    expect(newPlayer).toHaveProperty("breed", newPlayerData.breed);
    expect(newPlayer).toHaveProperty("status", newPlayerData.status);
    expect(newPlayer).toHaveProperty("id");
  });

  test("new player has correct default values", () => {
    expect(newPlayer).toHaveProperty("status", "bench");
    expect(newPlayer).toHaveProperty("teamId", null);
  });
});

describe("removePlayer", () => {
  const playerToRemove = {
    name: "Temporary Puppy",
    breed: "Temporary Breed",
    status: "bench",
    imageUrl: "https://learndotresources.s3.amazonaws.com/workshop/60ad725bbe74cd0004a6cba0/puppybowl-default-dog.png",
  };

  let playerId;

  beforeAll(async () => {
    const newPlayer = await addNewPlayer(playerToRemove);
    playerId = newPlayer.id;
  });

  test("removes a player by ID", async () => {
    await removePlayer(playerId);

    const players = await fetchAllPlayers();
    const deletedPlayer = players.find((player) => player.id === playerId);

    expect(deletedPlayer).toBeUndefined();
  });
});