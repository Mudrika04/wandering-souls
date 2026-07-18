import { motion } from "framer-motion";
import { FiMapPin, FiEdit3, FiGlobe, FiSmartphone, FiArrowRight } from "react-icons/fi";

const FLOATING_CHIPS = [
  { label: "Kyoto, 6 days", top: "10%", right: "38%", delay: 0 },
  { label: "Santorini, honeymoon", top: "42%", right: "2%", delay: 0.6 },
  { label: "Bali, solo trip", top: "72%", right: "30%", delay: 1.2 },
];

const FEATURES = [
  { icon: FiEdit3, text: "Describe it, don't fill forms" },
  { icon: FiGlobe, text: "Any destination, any style" },
  { icon: FiSmartphone, text: "Works great on mobile" },
];

const ROUTE_PATH = "M10 230 C 90 160, 120 80, 200 55 S 320 35, 350 15";

/**
 * Hero / landing section with a headline, subtext and a CTA that scrolls
 * the user down to the trip form. Includes decorative glow blobs, a subtle
 * grain texture, a flight-path illustration and floating destination chips
 * for visual richness on larger screens. All decorative elements live
 * inside a fixed-width, right-aligned "showcase" zone so nothing can ever
 * overflow past the viewport edge, regardless of screen width.
 */
export default function Hero() {
  const scrollToForm = () => {
    document.getElementById("planner")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-voyage-gradient text-white">
      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-lagoon-400/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-28 h-[26rem] w-[26rem] rounded-full bg-horizon-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-voyage-400/20 blur-3xl" />

      {/* Subtle grain / dot texture for depth */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Fixed-width showcase zone (desktop only) — everything inside is
          positioned relative to THIS box, never the viewport, so it can
          never spill past the browser edge. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] max-w-[30rem] lg:block">
        <svg
          className="absolute right-6 top-1/2 h-[20rem] w-full -translate-y-1/2 opacity-90"
          viewBox="0 0 360 250"
          fill="none"
          preserveAspectRatio="xMidYMid meet"
        >
          <path
            d={ROUTE_PATH}
            stroke="url(#routeGradient)"
            strokeWidth="2.5"
            strokeDasharray="2 10"
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="routeGradient" x1="0" y1="0" x2="360" y2="250" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4fd6c4" />
              <stop offset="1" stopColor="#ff7a4d" />
            </linearGradient>
          </defs>
          <circle cx="10" cy="230" r="5" fill="#4fd6c4" />
          <circle cx="200" cy="55" r="4" fill="#ffffff" fillOpacity="0.8" />
          <motion.g
            initial={{ offsetDistance: "0%" }}
            animate={{ offsetDistance: "100%" }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ offsetPath: `path('${ROUTE_PATH}')` }}
          >
            <circle r="6" fill="#ff9466" />
          </motion.g>
        </svg>

        {FLOATING_CHIPS.map((chip) => (
          <motion.div
            key={chip.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: [0, -8, 0] }}
            transition={{
              opacity: { duration: 0.6, delay: chip.delay },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: chip.delay },
            }}
            className="absolute flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/20 bg-voyage-900/70 px-3.5 py-2 text-xs font-medium text-white shadow-card backdrop-blur-md"
            style={{ top: chip.top, right: chip.right }}
          >
            <FiMapPin size={12} className="shrink-0 text-horizon-400" />
            {chip.label}
          </motion.div>
        ))}
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col items-start px-6 py-24 sm:py-32">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-lagoon-300"
        >
          <FiMapPin size={14} />
          Powered by Gemini AI
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl font-display text-4xl font-semibold leading-tight sm:text-6xl"
        >
          For every soul
          <br />
          <span className="bg-gradient-to-r from-horizon-400 to-lagoon-300 bg-clip-text text-transparent">
            that wanders.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-5 max-w-lg text-lg text-voyage-100"
        >
          Just describe your trip in your own words — where, with whom, what
          you love — and we'll turn it into a complete, editable day-by-day
          itinerary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <button
            type="button"
            onClick={scrollToForm}
            className="group flex items-center gap-2 rounded-full bg-horizon-gradient px-7 py-3.5 font-medium text-white shadow-card transition hover:brightness-110 active:scale-95"
          >
            Start planning
            <FiArrowRight className="transition-transform group-hover:translate-x-1" size={16} />
          </button>
        </motion.div>

        {/* Feature strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-sm text-voyage-200"
        >
          {FEATURES.map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2">
              <Icon size={15} className="text-lagoon-300" />
              {text}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Curved divider into the page content below */}
      <svg
        className="pointer-events-none absolute -bottom-1 left-0 w-full text-sand-50 dark:text-voyage-950"
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
      >
        <path d="M0 60 C 360 0, 1080 0, 1440 60 L1440 60 L0 60 Z" fill="currentColor" />
      </svg>
    </section>
  );
}
