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

// Function to generate a unique ID
export function generateUniqueId() {
  // Generate a random number and convert it to a hexadecimal string
  const randomNumber = Math.floor(Math.random() * Date.now()).toString(16);
  // Append a timestamp to ensure uniqueness
  const timestamp = Date.now().toString(16);
  // Concatenate the random number and timestamp to create the unique ID
  return `${randomNumber}-${timestamp}`;
}

export async function createGame(data, signal) {
  const url = new URL(`${API_BASE_URL}/matches`);
  return await fetchJson(
    url,
    { headers, signal, method: "POST", body: JSON.stringify({ data }) },
    []
  );
}

export async function fetchRankings(signal) {
  const url = `${API_BASE_URL}/players`;
  let data = await fetchJson(url, { headers, signal, method: "GET" }, []);
  return data;
}
