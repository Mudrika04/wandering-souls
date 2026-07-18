import { useState } from "react";
import { FiClock, FiDollarSign, FiTrash2, FiArrowUp, FiArrowDown, FiEdit2, FiCheck, FiMapPin } from "react-icons/fi";

/**
 * Displays a single activity within a day, with inline edit and
 * delete / reorder controls.
 *
 * @param {{
 *   activity: object,
 *   onDelete: () => void,
 *   onMoveUp: () => void,
 *   onMoveDown: () => void,
 *   onEdit: (updated: object) => void,
 *   isFirst: boolean,
 *   isLast: boolean
 * }} props
 */
export default function ActivityCard({ activity, onDelete, onMoveUp, onMoveDown, onEdit, isFirst, isLast }) {
  // Newly added stops open straight into edit mode so the user fills them
  // in immediately instead of staring at placeholder text.
  const [isEditing, setIsEditing] = useState(activity.place === "New stop");
  const [draft, setDraft] = useState(activity);

  const saveEdit = () => {
    onEdit(draft);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="rounded-lg border border-voyage-200 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
        <div className="grid gap-2 sm:grid-cols-2">
          <input
            value={draft.time}
            onChange={(e) => setDraft({ ...draft, time: e.target.value })}
            placeholder="Time"
            className="rounded-md border border-voyage-200 px-3 py-1.5 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <input
            value={draft.place}
            onChange={(e) => setDraft({ ...draft, place: e.target.value })}
            placeholder="Place"
            className="rounded-md border border-voyage-200 px-3 py-1.5 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <input
            value={draft.estimatedCost}
            onChange={(e) => setDraft({ ...draft, estimatedCost: e.target.value })}
            placeholder="Cost"
            className="rounded-md border border-voyage-200 px-3 py-1.5 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <input
            value={draft.duration}
            onChange={(e) => setDraft({ ...draft, duration: e.target.value })}
            placeholder="Duration"
            className="rounded-md border border-voyage-200 px-3 py-1.5 text-sm dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
          <textarea
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            placeholder="Description"
            rows={2}
            className="rounded-md border border-voyage-200 px-3 py-1.5 text-sm sm:col-span-2 dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>
        <button
          type="button"
          onClick={saveEdit}
          className="mt-3 flex items-center gap-1.5 rounded-full bg-voyage-600 px-4 py-1.5 text-sm text-white hover:bg-voyage-700"
        >
          <FiCheck size={14} /> Save
        </button>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-voyage-100 bg-white/70 p-4 transition hover:shadow-card sm:flex-row sm:items-start sm:justify-between dark:border-white/10 dark:bg-white/5">
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-voyage-500 dark:text-voyage-300">
          <span className="flex items-center gap-1">
            <FiClock size={12} /> {activity.time}
          </span>
          <span className="flex items-center gap-1">
            <FiDollarSign size={12} /> {activity.estimatedCost}
          </span>
          <span>{activity.duration}</span>
        </div>
        <p className="mt-1.5 flex items-center gap-1.5 font-medium text-voyage-900 dark:text-white">
          <FiMapPin size={14} className="text-horizon-500" />
          {activity.place}
        </p>
        {activity.description && (
          <p className="mt-1 text-sm text-voyage-600 dark:text-voyage-300">{activity.description}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100 sm:opacity-0">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={isFirst}
          aria-label="Move up"
          className="rounded-md p-1.5 text-voyage-500 hover:bg-voyage-100 disabled:opacity-30 dark:text-voyage-300 dark:hover:bg-white/10"
        >
          <FiArrowUp size={14} />
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={isLast}
          aria-label="Move down"
          className="rounded-md p-1.5 text-voyage-500 hover:bg-voyage-100 disabled:opacity-30 dark:text-voyage-300 dark:hover:bg-white/10"
        >
          <FiArrowDown size={14} />
        </button>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          aria-label="Edit activity"
          className="rounded-md p-1.5 text-voyage-500 hover:bg-voyage-100 dark:text-voyage-300 dark:hover:bg-white/10"
        >
          <FiEdit2 size={14} />
        </button>
        <button
          type="button"
          onClick={onDelete}
          aria-label="Delete activity"
          className="rounded-md p-1.5 text-horizon-600 hover:bg-horizon-500/10"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
}
