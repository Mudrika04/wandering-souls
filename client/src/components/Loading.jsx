import { FiCompass } from "react-icons/fi";

/**
 * Animated loading state shown while the itinerary is being generated.
 */
export default function Loading() {
  return (
    <div className="glass flex flex-col items-center justify-center rounded-xl2 p-12 text-center shadow-card animate-fadeUp">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-voyage-gradient text-white">
        <FiCompass size={26} className="animate-spinSlow" />
      </span>
      <p className="mt-5 font-display text-lg font-medium text-voyage-900 dark:text-white">
        Generating your itinerary...
      </p>
      <p className="mt-1 text-sm text-voyage-500 dark:text-voyage-300">
        This can take up to 30 seconds while the AI plans your trip.
      </p>
    </div>
  );
}
