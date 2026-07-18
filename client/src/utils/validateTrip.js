/**
 * Validates the trip form data before it is sent to the backend.
 * The free-form `description` is the primary required field; the
 * structured fields (destination, days, etc.) are optional refinements,
 * so they're only validated when the user actually filled them in.
 *
 * @param {object} formData - { description, destination, days, budget, travelType, interests, notes }
 * @returns {object} { isValid: boolean, errors: { [field]: string } }
 */
export function validateTripForm(formData) {
  const errors = {};

  const description = (formData.description || "").trim();
  if (description.length < 15) {
    errors.description =
      description.length === 0
        ? "Tell us a bit about your trip so the AI has something to work with."
        : "A little more detail helps — try at least a short sentence.";
  } else if (description.length > 1500) {
    errors.description = "That's a lot of detail! Please keep it under 1500 characters.";
  }

  if (formData.days !== "" && formData.days !== undefined && formData.days !== null) {
    const daysNum = Number(formData.days);
    if (Number.isNaN(daysNum) || daysNum < 1 || daysNum > 30) {
      errors.days = "Days must be a number between 1 and 30.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
