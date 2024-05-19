const API_BASE_URL = "http://localhost:5000/api";

const headers = new Headers();
headers.append("Content-Type", "application/json");

async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

export function generateUniqueId() {
  // Generate a random number and convert it to a hexadecimal string
  const randomNumber = Math.floor(Math.random() * Date.now()).toString(16);
  // Append a timestamp to ensure uniqueness
  const timestamp = Date.now().toString(16);
  // Concatenate the random number and timestamp to create the unique ID
  return `${randomNumber}-${timestamp}`;
}

export async function fetchRankings(signal) {
  const url = `${API_BASE_URL}/players`;
  let data = await fetchJson(url, { headers, signal, method: "GET" }, []);
  return data;
}

export async function searchPlayersByName(name) {
  try {
    const response = await fetchJson(`${API_BASE_URL}/players/${name}`);
    return response.sort((a, b) => {
      if (a.stateRank === null && b.stateRank === null) {
        return 0;
      } else if (a.stateRank === null) {
        return 1;
      } else if (b.stateRank === null) {
        return -1;
      }
      return a.stateRank - b.stateRank;
    });
  } catch (error) {
    console.error("Error searching players by name:", error);
    throw error;
  }
}

export async function findPlayerById(id) {
  try {
    const response = await fetchJson(`${API_BASE_URL}/players/id/${id}`);
    return response;
  } catch (error) {
    console.error("Error searching players by id:", error);
    throw error;
  }
}

export async function createMatch(formData) {
  try {
    // Fetch playerOne and playerTwo player IDs
    const playerOneId = await getPlayerId(formData, formData.playerOne_name);
    const playerTwoId = await getPlayerId(formData, formData.playerTwo_name);

    // Update formData with player IDs
    formData.playerOne_id = playerOneId;
    formData.playerTwo_id = playerTwoId;

    // Fetch player objects for playerOne and playerTwo players
    let [playerOne, playerTwo] = await Promise.all([
      findPlayerById(playerOneId),
      findPlayerById(playerTwoId),
    ]);

    // The following two statements are to make sure the proper player is player one.
    // The player with the highest USAA/World Rank should be player one, so if they are inputted as player two,
    // they will be switched to first.
    // If both players are USAA-unranked, the same applies, but for state ranks.

    if (playerOne.worldRank === 0 && playerTwo.worldRank === 0) {
      if (
        (playerTwo.stateRank < playerOne.stateRank &&
          playerTwo.stateRank > 0) ||
        playerOne.stateRank === 0
      ) {
        let temp = playerOne;
        playerOne = playerTwo;
        playerTwo = temp;
      }
    }

    // Switch players based on world ranks, if necessary
    if (playerTwo.worldRank > 0 && playerOne.worldRank >= 0) {
      if (
        (playerTwo.worldRank < playerOne.worldRank &&
          playerTwo.worldRank > 0) ||
        playerOne.worldRank === 0
      ) {
        let temp = playerOne;
        playerOne = playerTwo;
        playerTwo = temp;
      }
    }

    const matchData = {
      ...formData, // Include other formData fields
      players: [playerOne, playerTwo], // Add player objects to the players array
    };

    // Create the match with updated matchData
    const response = await fetchJson(`${API_BASE_URL}/matches`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...matchData }), // Send matchData in the POST request body
    });

    return response; // Return the response data
  } catch (error) {
    console.error("Error creating match:", error);
    throw error;
  }
}

export async function createSet(matchId) {
  try {
    const response = await fetchJson(`${API_BASE_URL}/matches/${matchId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        games: [],
        winner: null,
      }),
    });
    return response.set;
  } catch (error) {
    console.error("Error creating set:", error);
  }
}

export async function createGame(newGame) {
  try {
    const response = await fetchJson(
      `${API_BASE_URL}/matches/${newGame.matchId}/sets/${newGame.setId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newGame),
      }
    );
    console.log(response);
    return response;
  } catch (err) {
    console.error("Error creating game:", err);
    throw err;
  }
}

async function getPlayerId(formData, name) {
  try {
    // Search for the player by name to get the player object
    const players = await searchPlayersByName(name.split(" ")[0]);
    // If the player object is found, return the player's ID
    if (players.length === 1) {
      return players[0]._id;
    } else if (players.length > 1) {
      for (let player of players) {
        if (
          (player.stateRank === formData.playerOne_state_rank ||
            player.stateRank === formData.playerTwo_state_rank) &&
          (player.worldRank === formData.playerOne_world_rank ||
            player.worldRank === formData.playerTwo_world_rank)
        ) {
          return player._id;
        }
      }
    } else {
      throw new Error(`Player "${name}" not found.`);
    }
  } catch (error) {
    console.error("Error fetching player ID:", error);
    throw error;
  }
}

export async function fetchMatches(signal) {
  const url = `${API_BASE_URL}/matches`;
  let data = await fetchJson(url, { headers, signal, method: "GET" }, []);
  return data;
}

export async function fetchMatchDetailsById(matchId) {
  try {
    const response = await fetchJson(`${API_BASE_URL}/matches/${matchId}`, {
      headers,
      method: "GET",
    });
    return response;
  } catch (error) {
    console.error("Error searching matches by id:", error);
    throw error;
  }
}

export async function listGames(matchId, setId) {
  const url = `${API_BASE_URL}/matches/${matchId}/sets/${setId}`;
  let data = await fetchJson(url, { headers, method: "GET" }, []);
  return data.games;
}

export async function searchMatchesByPlayerName(playerName) {
  try {
    // Fetch all players with the given name
    const players = await searchPlayersByName(playerName);
    
    // If no players found, return an empty array
    if (players.length === 0) {
      return [];
    }

    // Create an array to store matches
    const allMatches = [];

    // Fetch matches for each player
    for (const player of players) {
      const matches = await fetchJson(`${API_BASE_URL}/matches/players/${player._id}`);
      allMatches.push(...matches);
    }

    // Sort matches chronologically by date
    return allMatches.sort((a, b) => new Date(a.date) - new Date(b.date));
  } catch (error) {
    console.error("Error searching matches:", error);
    throw error;
  }
}
