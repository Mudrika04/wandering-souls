import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

/**
 * Root application component. Owns global dark-mode state and renders
 * the persistent navbar/footer around the page content.
 */
export default function App() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("wandering-souls:theme") === "dark";
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("wandering-souls:theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="min-h-screen bg-sand-50 dark:bg-voyage-950">
      <Navbar isDark={isDark} onToggleDark={() => setIsDark((prev) => !prev)} />
      <Home />
      <footer className="border-t border-voyage-100 py-8 text-center text-sm text-voyage-500 dark:border-white/10 dark:text-voyage-400">
        Built with React, Express and Gemini AI. &copy; {new Date().getFullYear()} Wandering Souls.
      </footer>
    </div>
  );
}
