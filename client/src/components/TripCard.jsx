import { useState } from "react";
import { FiTrash2, FiCopy, FiDownload, FiCheck, FiRefreshCw } from "react-icons/fi";
import DayAccordion from "./DayAccordion";
import { itineraryToText } from "../utils/parseResponse";

/**
 * Top-level card that renders a full itinerary: title, summary, day
 * accordions, and trip-level actions (copy, download, delete, regenerate).
 *
 * @param {{
 *   itinerary: object,
 *   onDelete: () => void,
 *   onRegenerate: () => void,
 *   onUpdateItinerary: (updated: object) => void
 * }} props
 */
export default function TripCard({ itinerary, onDelete, onRegenerate, onUpdateItinerary }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(itineraryToText(itinerary));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (e.g. insecure context); fail silently.
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(itinerary, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${itinerary.tripTitle.replace(/\s+/g, "-").toLowerCase()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const updateDay = (dayNumber, updatedActivities) => {
    const updatedDays = itinerary.days.map((day) =>
      day.day === dayNumber ? { ...day, activities: updatedActivities } : day
    );
    onUpdateItinerary({ ...itinerary, days: updatedDays });
  };

  const handleDeleteActivity = (dayNumber, activityId) => {
    const day = itinerary.days.find((d) => d.day === dayNumber);
    updateDay(dayNumber, day.activities.filter((a) => a.id !== activityId));
  };

  const handleMoveActivity = (dayNumber, activityId, direction) => {
    const day = itinerary.days.find((d) => d.day === dayNumber);
    const index = day.activities.findIndex((a) => a.id === activityId);
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= day.activities.length) return;

    const reordered = [...day.activities];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    updateDay(dayNumber, reordered);
  };

  const handleEditActivity = (dayNumber, activityId, updated) => {
    const day = itinerary.days.find((d) => d.day === dayNumber);
    updateDay(
      dayNumber,
      day.activities.map((a) => (a.id === activityId ? { ...a, ...updated } : a))
    );
  };

  const handleAddActivity = (dayNumber) => {
    const day = itinerary.days.find((d) => d.day === dayNumber);
    const newActivity = {
      id: `${dayNumber}-new-${Date.now()}`,
      time: "TBD",
      place: "New stop",
      description: "",
      estimatedCost: "N/A",
      duration: "N/A",
    };
    updateDay(dayNumber, [...day.activities, newActivity]);
  };

  return (
    <div className="animate-fadeUp rounded-xl2 bg-white/80 p-6 shadow-card dark:bg-voyage-900/60 sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h3 className="font-display text-2xl font-semibold text-voyage-900 dark:text-white">
            {itinerary.tripTitle}
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-voyage-600 dark:text-voyage-300">{itinerary.summary}</p>
          <p className="mt-2 text-xs text-voyage-400 dark:text-voyage-400">
            {itinerary.days.length} {itinerary.days.length === 1 ? "day" : "days"}
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-full border border-voyage-200 px-3.5 py-2 text-xs font-medium text-voyage-700 hover:bg-voyage-100/60 dark:border-white/10 dark:text-voyage-100 dark:hover:bg-white/10"
          >
            {copied ? <FiCheck size={13} /> : <FiCopy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center gap-1.5 rounded-full border border-voyage-200 px-3.5 py-2 text-xs font-medium text-voyage-700 hover:bg-voyage-100/60 dark:border-white/10 dark:text-voyage-100 dark:hover:bg-white/10"
          >
            <FiDownload size={13} />
            JSON
          </button>
          <button
            type="button"
            onClick={onRegenerate}
            className="flex items-center gap-1.5 rounded-full border border-voyage-200 px-3.5 py-2 text-xs font-medium text-voyage-700 hover:bg-voyage-100/60 dark:border-white/10 dark:text-voyage-100 dark:hover:bg-white/10"
          >
            <FiRefreshCw size={13} />
            Regenerate
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="flex items-center gap-1.5 rounded-full border border-horizon-500/30 px-3.5 py-2 text-xs font-medium text-horizon-600 hover:bg-horizon-500/10"
          >
            <FiTrash2 size={13} />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {itinerary.days.map((day, index) => (
          <DayAccordion
            key={day.day}
            day={day}
            defaultOpen={index === 0}
            onDeleteActivity={(activityId) => handleDeleteActivity(day.day, activityId)}
            onMoveActivity={(activityId, direction) => handleMoveActivity(day.day, activityId, direction)}
            onEditActivity={(activityId, updated) => handleEditActivity(day.day, activityId, updated)}
            onAddActivity={() => handleAddActivity(day.day)}
          />
        ))}
      </div>
    </div>
  );
}
