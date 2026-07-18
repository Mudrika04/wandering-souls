import { FiMap } from "react-icons/fi";

/**
 * Placeholder shown before any itinerary has been generated.
 */
export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl2 border border-dashed border-voyage-300 p-12 text-center dark:border-white/10">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-voyage-100 text-voyage-500 dark:bg-white/10 dark:text-voyage-300">
        <FiMap size={24} />
      </span>
      <p className="mt-4 font-display text-lg font-medium text-voyage-800 dark:text-white">
        No itinerary yet
      </p>
      <p className="mt-1 max-w-xs text-sm text-voyage-500 dark:text-voyage-300">
        Describe your trip above and generate your first AI-planned itinerary.
      </p>
    </div>
  );
}
