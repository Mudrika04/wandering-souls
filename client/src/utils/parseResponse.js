/**
 * Normalizes a raw itinerary object from the API into a predictable shape
 * the UI can safely render, filling in defensive defaults for any
 * missing/optional fields so components never crash on undefined.
 *
 * @param {object} data - raw itinerary object from the backend
 * @returns {object} normalized itinerary
 */
export function parseItinerary(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Itinerary data is missing or malformed.");
  }

  const days = Array.isArray(data.days) ? data.days : [];

  const normalizedDays = days.map((day, dayIndex) => ({
    day: day.day ?? dayIndex + 1,
    title: day.title || `Day ${dayIndex + 1}`,
    activities: Array.isArray(day.activities)
      ? day.activities.map((activity, actIndex) => ({
          id: `${dayIndex}-${actIndex}-${Date.now()}`,
          time: activity.time || "TBD",
          place: activity.place || "Untitled activity",
          description: activity.description || "",
          estimatedCost: activity.estimatedCost || "N/A",
          duration: activity.duration || "N/A",
        }))
      : [],
  }));

  return {
    tripTitle: data.tripTitle || "Your Trip",
    summary: data.summary || "",
    days: normalizedDays,
    createdAt: new Date().toISOString(),
  };
}

/**
 * Produces a plain-text version of the itinerary, used for the
 * "Copy Itinerary" feature.
 * @param {object} itinerary - normalized itinerary object
 * @returns {string}
 */
export function itineraryToText(itinerary) {
  let text = `${itinerary.tripTitle}\n${itinerary.summary}\n\n`;

  itinerary.days.forEach((day) => {
    text += `Day ${day.day}: ${day.title}\n`;
    day.activities.forEach((activity) => {
      text += `  - [${activity.time}] ${activity.place} (${activity.duration}, ${activity.estimatedCost})\n`;
      if (activity.description) {
        text += `    ${activity.description}\n`;
      }
    });
    text += "\n";
  });

  return text.trim();
}
