import { useState } from "react";
import { FiSend, FiX, FiSliders, FiChevronDown } from "react-icons/fi";
import { validateTripForm } from "../utils/validateTrip";

const BUDGET_OPTIONS = ["Low", "Medium", "High", "Luxury"];
const TRAVEL_TYPES = ["Solo", "Couple", "Family", "Friends", "Business"];
const SUGGESTED_INTERESTS = [
  "Food",
  "Nature",
  "History",
  "Adventure",
  "Nightlife",
  "Shopping",
  "Art",
  "Relaxation",
  "Anime",
  "Beaches",
];

const EXAMPLE_PROMPTS = [
  "10 days backpacking through Vietnam, street food and hidden temples, tight budget.",
  "A relaxed 4-day honeymoon in Santorini — sunsets, good wine, no rushing.",
  "Weekend in Tokyo with my sister, we love anime, ramen and quirky shops.",
];

const INITIAL_STATE = {
  description: "",
  destination: "",
  days: "",
  budget: "Medium",
  travelType: "Solo",
  interests: [],
  notes: "",
};

/**
 * Trip planning form. The primary input is free-form text describing the
 * trip in the user's own words — this is what gets sent to the AI. An
 * optional "fine-tune" section lets the user add structured constraints
 * (exact day count, budget tier, travel type, interest tags) that get
 * layered on top of the description without replacing it.
 *
 * @param {{ onSubmit: (data: object) => void, isLoading: boolean }} props
 */
export default function TripForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [interestInput, setInterestInput] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const addInterest = (value) => {
    const trimmed = value.trim();
    if (!trimmed || formData.interests.includes(trimmed)) return;
    setFormData((prev) => ({ ...prev, interests: [...prev.interests, trimmed] }));
    setInterestInput("");
  };

  const removeInterest = (interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addInterest(interestInput);
    }
  };

  const useExample = (text) => {
    updateField("description", text);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateTripForm(formData);
    setErrors(validationErrors);
    if (isValid) {
      onSubmit(formData);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass rounded-xl2 p-6 shadow-card sm:p-8"
      aria-label="Trip description form"
    >
      <h2 className="font-display text-2xl font-semibold text-voyage-900 dark:text-white">
        Tell us about your trip
      </h2>
      <p className="mt-1 text-sm text-voyage-600 dark:text-voyage-200">
        Write it however you'd say it to a friend — the AI turns it into a real itinerary.
      </p>

      {/* Primary free-form input */}
      <div className="mt-6">
        <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-voyage-800 dark:text-voyage-100">
          Describe your trip
        </label>
        <textarea
          id="description"
          rows={4}
          placeholder="e.g. 6 days in Kyoto and Osaka, mid-range budget, travelling with my partner. We love food, quiet temples, and want at least one day trip out of the city."
          value={formData.description}
          onChange={(e) => updateField("description", e.target.value)}
          className="w-full resize-none rounded-lg border border-voyage-200 bg-white/80 px-4 py-3 text-voyage-900 outline-none ring-voyage-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
        />
        {errors.description && <p className="mt-1 text-xs text-horizon-600">{errors.description}</p>}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {EXAMPLE_PROMPTS.map((example) => (
            <button
              type="button"
              key={example}
              onClick={() => useExample(example)}
              className="rounded-full border border-dashed border-voyage-300 px-3 py-1 text-left text-xs text-voyage-500 hover:bg-voyage-100/60 dark:border-white/20 dark:text-voyage-300 dark:hover:bg-white/10"
            >
              "{example.length > 46 ? `${example.slice(0, 46)}…` : example}"
            </button>
          ))}
        </div>
      </div>

      {/* Optional structured refinements */}
      <div className="mt-5 border-t border-voyage-100 pt-4 dark:border-white/10">
        <button
          type="button"
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="flex items-center gap-1.5 text-sm font-medium text-voyage-700 dark:text-voyage-200"
          aria-expanded={showAdvanced}
        >
          <FiSliders size={14} />
          Fine-tune the details
          <FiChevronDown className={`transition-transform duration-300 ${showAdvanced ? "rotate-180" : ""}`} />
        </button>
        <p className="mt-1 text-xs text-voyage-500 dark:text-voyage-400">
          Optional — pin down exact numbers if your description leaves them open.
        </p>

        {showAdvanced && (
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            {/* Destination (optional override) */}
            <div>
              <label htmlFor="destination" className="mb-1.5 block text-sm font-medium text-voyage-800 dark:text-voyage-100">
                Destination
              </label>
              <input
                id="destination"
                type="text"
                placeholder="Leave blank to let the AI infer it"
                value={formData.destination}
                onChange={(e) => updateField("destination", e.target.value)}
                className="w-full rounded-lg border border-voyage-200 bg-white/80 px-4 py-2.5 text-voyage-900 outline-none ring-voyage-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>

            {/* Days (optional override) */}
            <div>
              <label htmlFor="days" className="mb-1.5 block text-sm font-medium text-voyage-800 dark:text-voyage-100">
                Days
              </label>
              <input
                id="days"
                type="number"
                min={1}
                max={30}
                placeholder="Leave blank to let the AI infer it"
                value={formData.days}
                onChange={(e) => updateField("days", e.target.value)}
                className="w-full rounded-lg border border-voyage-200 bg-white/80 px-4 py-2.5 text-voyage-900 outline-none ring-voyage-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              {errors.days && <p className="mt-1 text-xs text-horizon-600">{errors.days}</p>}
            </div>

            {/* Budget */}
            <div>
              <label htmlFor="budget" className="mb-1.5 block text-sm font-medium text-voyage-800 dark:text-voyage-100">
                Budget
              </label>
              <select
                id="budget"
                value={formData.budget}
                onChange={(e) => updateField("budget", e.target.value)}
                className="w-full rounded-lg border border-voyage-200 bg-white/80 px-4 py-2.5 text-voyage-900 outline-none ring-voyage-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
              >
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Travel type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-voyage-800 dark:text-voyage-100">
                Travel type
              </label>
              <div className="flex flex-wrap gap-2">
                {TRAVEL_TYPES.map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => updateField("travelType", type)}
                    className={`rounded-full border px-3.5 py-1.5 text-sm transition ${
                      formData.travelType === type
                        ? "border-voyage-600 bg-voyage-600 text-white"
                        : "border-voyage-200 text-voyage-700 hover:bg-voyage-100/60 dark:border-white/10 dark:text-voyage-100 dark:hover:bg-white/10"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="sm:col-span-2">
              <label htmlFor="interests" className="mb-1.5 block text-sm font-medium text-voyage-800 dark:text-voyage-100">
                Interests
              </label>
              <div className="flex flex-wrap gap-2">
                {formData.interests.map((interest) => (
                  <span
                    key={interest}
                    className="flex items-center gap-1 rounded-full bg-lagoon-400/20 px-3 py-1 text-sm text-lagoon-500 dark:text-lagoon-300"
                  >
                    {interest}
                    <button type="button" onClick={() => removeInterest(interest)} aria-label={`Remove ${interest}`}>
                      <FiX size={13} />
                    </button>
                  </span>
                ))}
              </div>
              <input
                id="interests"
                type="text"
                placeholder="Type an interest and press Enter"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyDown={handleInterestKeyDown}
                className="mt-2 w-full rounded-lg border border-voyage-200 bg-white/80 px-4 py-2.5 text-voyage-900 outline-none ring-voyage-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {SUGGESTED_INTERESTS.filter((i) => !formData.interests.includes(i)).map((interest) => (
                  <button
                    type="button"
                    key={interest}
                    onClick={() => addInterest(interest)}
                    className="rounded-full border border-dashed border-voyage-300 px-3 py-1 text-xs text-voyage-500 hover:bg-voyage-100/60 dark:border-white/20 dark:text-voyage-300 dark:hover:bg-white/10"
                  >
                    + {interest}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-voyage-800 dark:text-voyage-100">
                Anything else to add
              </label>
              <textarea
                id="notes"
                rows={2}
                placeholder="e.g. I love hidden places, avoid early mornings."
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                className="w-full resize-none rounded-lg border border-voyage-200 bg-white/80 px-4 py-2.5 text-voyage-900 outline-none ring-voyage-400 focus:ring-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
              />
            </div>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-7 flex w-full items-center justify-center gap-2 rounded-full bg-horizon-gradient px-6 py-3.5 font-medium text-white shadow-card transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        <FiSend size={16} />
        {isLoading ? "Generating..." : "Generate itinerary"}
      </button>
    </form>
  );
}
