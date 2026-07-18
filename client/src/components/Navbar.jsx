import { FiFeather, FiMoon, FiSun } from "react-icons/fi";

/**
 * Top navigation bar. Contains the brand mark and a dark-mode toggle.
 * @param {{ isDark: boolean, onToggleDark: () => void }} props
 */
export default function Navbar({ isDark, onToggleDark }) {
  return (
    <header className="sticky top-0 z-40 glass shadow-glass">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-voyage-gradient text-white shadow-card">
            <FiFeather size={17} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight text-voyage-900 dark:text-white">
            Wandering <span className="text-horizon-500">Souls</span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#planner"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-voyage-700 hover:bg-voyage-100/60 dark:text-voyage-100 dark:hover:bg-white/10 sm:block"
          >
            Plan a trip
          </a>
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-voyage-200/60 text-voyage-700 transition hover:bg-voyage-100/60 dark:border-white/10 dark:text-voyage-100 dark:hover:bg-white/10"
          >
            {isDark ? <FiSun size={17} /> : <FiMoon size={17} />}
          </button>
        </div>
      </nav>
    </header>
  );
}
