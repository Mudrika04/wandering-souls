import { useState } from "react";
import { FiChevronDown, FiPlus } from "react-icons/fi";
import ActivityCard from "./ActivityCard";

/**
 * Accordion for a single day of the itinerary. Expands/collapses to show
 * that day's activities ("stops"), and exposes add/reorder/delete/edit
 * callbacks so the whole day is interactive, not just display-only.
 *
 * @param {{
 *   day: object,
 *   defaultOpen: boolean,
 *   onDeleteActivity: (activityId: string) => void,
 *   onMoveActivity: (activityId: string, direction: "up" | "down") => void,
 *   onEditActivity: (activityId: string, updated: object) => void,
 *   onAddActivity: () => void
 * }} props
 */
export default function DayAccordion({
  day,
  defaultOpen = false,
  onDeleteActivity,
  onMoveActivity,
  onEditActivity,
  onAddActivity,
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-xl2 border border-voyage-100 bg-white/60 dark:border-white/10 dark:bg-white/5">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-5 py-4 text-left"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-voyage-gradient text-sm font-semibold text-white">
            {day.day}
          </span>
          <div>
            <p className="font-display font-medium text-voyage-900 dark:text-white">{day.title}</p>
            <p className="text-xs text-voyage-500 dark:text-voyage-300">
              {day.activities.length} {day.activities.length === 1 ? "stop" : "stops"}
            </p>
          </div>
        </div>
        <FiChevronDown
          className={`text-voyage-500 transition-transform duration-300 dark:text-voyage-300 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="space-y-3 border-t border-voyage-100 px-5 py-4 dark:border-white/10">
          {day.activities.length === 0 ? (
            <p className="text-sm text-voyage-500 dark:text-voyage-300">No stops for this day yet.</p>
          ) : (
            day.activities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                isFirst={index === 0}
                isLast={index === day.activities.length - 1}
                onDelete={() => onDeleteActivity(activity.id)}
                onMoveUp={() => onMoveActivity(activity.id, "up")}
                onMoveDown={() => onMoveActivity(activity.id, "down")}
                onEdit={(updated) => onEditActivity(activity.id, updated)}
              />
            ))
          )}

          <button
            type="button"
            onClick={onAddActivity}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-voyage-300 py-2.5 text-sm font-medium text-voyage-600 transition hover:border-voyage-400 hover:bg-voyage-100/60 dark:border-white/20 dark:text-voyage-300 dark:hover:bg-white/10"
          >
            <FiPlus size={14} />
            Add a stop
          </button>
        </div>
      )}
    </div>
  );
}
