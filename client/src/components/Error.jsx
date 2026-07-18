import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

const FRIENDLY_MESSAGES = {
  NETWORK_ERROR: "We couldn't reach the server. Check your connection and try again.",
  TIMEOUT: "The AI took too long to respond. Please try again.",
  API_ERROR: "The AI service had a problem generating your trip. Please try again.",
  EMPTY_RESPONSE: "The AI returned an empty response. Please try again.",
  MALFORMED_RESPONSE: "The AI response couldn't be understood. Please try again.",
  INVALID_AI_RESPONSE: "The AI response was incomplete. Please try again.",
  VALIDATION_ERROR: "Please check the trip details you entered.",
  CONFIG_ERROR: "The server is missing configuration. Please contact support.",
};

/**
 * Displays a friendly error card with a retry action.
 * @param {{ error: { message: string, code?: string }, onRetry: () => void }} props
 */
export default function ErrorCard({ error, onRetry }) {
  const message = FRIENDLY_MESSAGES[error?.code] || error?.message || "Something went wrong. Please try again.";

  return (
    <div className="glass flex flex-col items-center justify-center rounded-xl2 border border-horizon-500/20 p-10 text-center shadow-card animate-fadeUp">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-horizon-500/15 text-horizon-600">
        <FiAlertTriangle size={22} />
      </span>
      <p className="mt-4 font-display text-lg font-medium text-voyage-900 dark:text-white">
        Couldn't generate your itinerary
      </p>
      <p className="mt-1 max-w-sm text-sm text-voyage-500 dark:text-voyage-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 rounded-full bg-voyage-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-voyage-700"
      >
        <FiRefreshCw size={15} />
        Try again
      </button>
    </div>
  );
}
