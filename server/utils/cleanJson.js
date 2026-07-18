/**
 * cleanJson.js
 *
 * Gemini is instructed to return raw JSON only, but in practice it can still
 * wrap the payload in ```json fences, add a leading/trailing sentence, or
 * include stray whitespace. This utility defensively strips all of that and
 * returns a parsed JavaScript object.
 *
 * Throws a descriptive Error if the text cannot be turned into valid JSON,
 * so callers can respond with a clean 502/500 instead of crashing.
 */

/**
 * Removes markdown code fences (```json ... ``` or ``` ... ```) from a string.
 * @param {string} text
 * @returns {string}
 */
function stripMarkdownFences(text) {
  return text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}

/**
 * Extracts the first balanced JSON object/array substring from a block of text.
 * This protects against cases where the model adds a stray sentence before or
 * after the JSON payload (e.g. "Here is your itinerary: { ... }").
 * @param {string} text
 * @returns {string}
 */
function extractJsonSubstring(text) {
  const firstBrace = text.indexOf("{");
  const firstBracket = text.indexOf("[");

  let start = -1;
  if (firstBrace === -1) {
    start = firstBracket;
  } else if (firstBracket === -1) {
    start = firstBrace;
  } else {
    start = Math.min(firstBrace, firstBracket);
  }

  if (start === -1) {
    throw new Error("No JSON object or array found in the response text.");
  }

  const openChar = text[start];
  const closeChar = openChar === "{" ? "}" : "]";

  let depth = 0;
  let end = -1;

  for (let i = start; i < text.length; i += 1) {
    if (text[i] === openChar) depth += 1;
    if (text[i] === closeChar) depth -= 1;

    if (depth === 0) {
      end = i;
      break;
    }
  }

  if (end === -1) {
    throw new Error("Could not find a balanced JSON block in the response text.");
  }

  return text.slice(start, end + 1);
}

/**
 * Cleans and parses raw AI text output into a JavaScript object.
 * @param {string} rawText - The raw text returned by the Gemini API.
 * @returns {object} Parsed JSON object.
 * @throws {Error} If the text cannot be parsed into valid JSON.
 */
function cleanJson(rawText) {
  if (!rawText || typeof rawText !== "string" || rawText.trim().length === 0) {
    throw new Error("Empty response received from AI service.");
  }

  const withoutFences = stripMarkdownFences(rawText);
  const jsonCandidate = extractJsonSubstring(withoutFences);

  try {
    return JSON.parse(jsonCandidate);
  } catch (err) {
    throw new Error(`Failed to parse AI response as JSON: ${err.message}`);
  }
}

module.exports = { cleanJson, stripMarkdownFences, extractJsonSubstring };
