const { generateItinerary } = require("../services/geminiService");

/**
 * Validates the incoming trip request body. `description` (the free-form
 * text the user typed) is the only required field — everything else is an
 * optional structured refinement the user may or may not have filled in.
 * @param {object} body
 * @returns {string|null} error message, or null if valid
 */
function validateRequestBody(body) {
  const { description, days } = body;

  if (!description || typeof description !== "string" || description.trim().length < 15) {
    return "Please describe your trip in at least a short sentence.";
  }
  if (description.trim().length > 1500) {
    return "Trip description is too long (max 1500 characters).";
  }
  if (days !== undefined && days !== null && days !== "") {
    if (Number.isNaN(Number(days)) || Number(days) < 1 || Number(days) > 30) {
      return "Days must be a number between 1 and 30.";
    }
  }
  return null;
}

/**
 * Validates the shape of the itinerary object returned by Gemini.
 * @param {object} itinerary
 * @returns {string|null} error message, or null if valid
 */
function validateItineraryShape(itinerary) {
  if (!itinerary || typeof itinerary !== "object") {
    return "AI response was not a JSON object.";
  }
  if (!itinerary.tripTitle || typeof itinerary.tripTitle !== "string") {
    return "AI response is missing 'tripTitle'.";
  }
  if (!itinerary.summary || typeof itinerary.summary !== "string") {
    return "AI response is missing 'summary'.";
  }
  if (!Array.isArray(itinerary.days) || itinerary.days.length === 0) {
    return "AI response is missing a valid 'days' array.";
  }
  for (const day of itinerary.days) {
    if (!Array.isArray(day.activities)) {
      return `Day ${day.day || "?"} is missing a valid 'activities' array.`;
    }
  }
  return null;
}

/**
 * POST /generate-trip
 * Accepts trip requirements, calls Gemini, validates and returns itinerary JSON.
 */
async function generateTrip(req, res) {
  const validationError = validateRequestBody(req.body);
  if (validationError) {
    return res.status(400).json({
      success: false,
      error: "VALIDATION_ERROR",
      message: validationError,
    });
  }

  try {
    const itinerary = await generateItinerary(req.body);

    const shapeError = validateItineraryShape(itinerary);
    if (shapeError) {
      return res.status(502).json({
        success: false,
        error: "INVALID_AI_RESPONSE",
        message: shapeError,
      });
    }

    return res.status(200).json({
      success: true,
      data: itinerary,
    });
  } catch (err) {
    const statusByCode = {
      CONFIG_ERROR: 500,
      TIMEOUT: 504,
      API_ERROR: 502,
      EMPTY_RESPONSE: 502,
      MALFORMED_RESPONSE: 502,
    };

    const status = statusByCode[err.code] || 500;

    return res.status(status).json({
      success: false,
      error: err.code || "UNKNOWN_ERROR",
      message: err.message || "Something went wrong while generating your itinerary.",
    });
  }
}

module.exports = { generateTrip, validateRequestBody, validateItineraryShape };
