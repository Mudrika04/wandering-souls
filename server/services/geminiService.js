const { GoogleGenAI } = require("@google/genai");
const { cleanJson } = require("../utils/cleanJson");

const GEMINI_TIMEOUT_MS = 25000;

/**
 * Builds the strict prompt sent to Gemini. The user's free-form description
 * is the primary source of truth for what the trip should be; any
 * structured fields the user optionally filled in (exact day count, budget
 * tier, travel type, interest tags) are layered on as explicit constraints
 * that override anything ambiguous in the description.
 *
 * The schema and rules are intentionally repeated/emphasized because
 * smaller models are more likely to follow instructions that are stated
 * plainly and more than once.
 */
function buildPrompt({ description, destination, days, budget, travelType, interests, notes }) {
  const interestsText = Array.isArray(interests) && interests.length > 0 ? interests.join(", ") : null;

  const constraints = [
    destination ? `- Destination must be: ${destination}` : null,
    days ? `- Trip length must be exactly ${days} days` : null,
    budget ? `- Budget level: ${budget}` : null,
    travelType ? `- Travelling as: ${travelType}` : null,
    interestsText ? `- Traveller interests: ${interestsText}` : null,
    notes ? `- Additional notes: ${notes}` : null,
  ].filter(Boolean);

  const constraintsBlock = constraints.length > 0
    ? `\n\nThe traveller also gave these specific constraints — follow them exactly, even if they refine or override something implied by the description above:\n${constraints.join("\n")}`
    : "";

  return `You are a professional travel planner AI.

A traveller described their trip like this, in their own words:
"""
${description}
"""

Read the description carefully and infer the destination, trip length, pace, budget and interests from it. Use your best judgement to fill in anything it leaves vague.${constraintsBlock}

If the description or constraints don't specify a number of days, choose a sensible length yourself (typically 3-7 days).

Return ONLY valid JSON. Do not include markdown formatting, code fences (no \`\`\`json), or any explanation text before or after the JSON.

Follow this EXACT schema:

{
  "tripTitle": "string",
  "summary": "string",
  "days": [
    {
      "day": 1,
      "title": "string",
      "activities": [
        {
          "time": "string, e.g. 9:00 AM",
          "place": "string",
          "description": "string",
          "estimatedCost": "string, e.g. $20",
          "duration": "string, e.g. 2 hours"
        }
      ]
    }
  ]
}

Rules:
- The "days" array length must match the trip length you determined above.
- Every day must have at least 3 activities.
- No markdown. No backticks. No explanations. No trailing commentary.
- Return ONLY the JSON object described above, nothing else.`;
}

/**
 * Wraps a promise with a timeout so a slow/hanging Gemini call cannot hang
 * the whole request indefinitely.
 */
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => {
      reject(new Error("TIMEOUT"));
    }, ms);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

/**
 * Calls the Gemini API with the trip requirements and returns a parsed,
 * validated-shape JSON object representing the itinerary.
 *
 * @param {object} tripRequest
 * @returns {Promise<object>} parsed itinerary JSON
 */
async function generateItinerary(tripRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const err = new Error("GEMINI_API_KEY is not configured on the server.");
    err.code = "CONFIG_ERROR";
    throw err;
  }

  const ai = new GoogleGenAI({
    apiKey,
  });

  const prompt = buildPrompt(tripRequest);

  let response;

  try {
    console.log("Using Gemini model:", process.env.GEMINI_MODEL);
    response = await withTimeout(
      ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.8,
          responseMimeType: "application/json",
        },
      }),
      GEMINI_TIMEOUT_MS
    );
  } catch (err) {
    if (err.message === "TIMEOUT") {
      const timeoutErr = new Error("The AI service took too long to respond.");
      timeoutErr.code = "TIMEOUT";
      throw timeoutErr;
    }

    const apiErr = new Error(`Gemini API request failed: ${err.message}`);
    apiErr.code = "API_ERROR";
    throw apiErr;
  }

  const rawText = response.text;

  if (!rawText || rawText.trim().length === 0) {
    const emptyErr = new Error("Gemini returned an empty response.");
    emptyErr.code = "EMPTY_RESPONSE";
    throw emptyErr;
  }

  try {
    return cleanJson(rawText);
  } catch (err) {
    const parseErr = new Error(`Malformed response from AI: ${err.message}`);
    parseErr.code = "MALFORMED_RESPONSE";
    throw parseErr;
  }
}

module.exports = { generateItinerary, buildPrompt };
