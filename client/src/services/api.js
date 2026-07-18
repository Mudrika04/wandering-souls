import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Sends trip requirements to the backend and returns the generated itinerary.
 * Accepts an AbortController signal so callers can cancel stale requests
 * (e.g. when the user clicks "Generate" again before the first call finishes).
 *
 * @param {object} tripRequest - { destination, days, budget, travelType, interests, notes }
 * @param {AbortSignal} [signal]
 * @returns {Promise<object>} itinerary data
 */
export async function generateTrip(tripRequest, signal) {
  try {
    const response = await apiClient.post("/generate-trip", tripRequest, { signal });

    if (!response.data || response.data.success !== true) {
      throw new ApiError(
        response.data?.message || "The server returned an unexpected response.",
        response.data?.error || "UNKNOWN_ERROR"
      );
    }

    return response.data.data;
  } catch (err) {
    if (axios.isCancel(err) || err.code === "ERR_CANCELED") {
      const cancelErr = new Error("Request cancelled.");
      cancelErr.code = "CANCELLED";
      throw cancelErr;
    }

    if (err instanceof ApiError) {
      throw err;
    }

    if (err.response) {
      // Server responded with an error status
      throw new ApiError(
        err.response.data?.message || "The server could not generate an itinerary.",
        err.response.data?.error || "SERVER_ERROR"
      );
    }

    if (err.request) {
      // Request was made but no response received
      throw new ApiError(
        "Could not reach the server. Please check your connection and try again.",
        "NETWORK_ERROR"
      );
    }

    throw new ApiError(err.message || "Something went wrong.", "UNKNOWN_ERROR");
  }
}

/**
 * Custom error class that carries a machine-readable error code alongside
 * a human-readable message, so the UI can decide how to react.
 */
export class ApiError extends Error {
  constructor(message, code) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

export default apiClient;
