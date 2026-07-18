import { useState, useRef, useEffect } from "react";
import Hero from "../components/Hero";
import TripForm from "../components/TripForm";
import Loading from "../components/Loading";
import ErrorCard from "../components/Error";
import EmptyState from "../components/EmptyState";
import TripCard from "../components/TripCard";
import { generateTrip } from "../services/api";
import { parseItinerary } from "../utils/parseResponse";

const STORAGE_KEY = "wandering-souls:trips";

/**
 * Home page: owns all trip-planning state (loading/error/itinerary list)
 * and coordinates the form, backend calls, and result display.
 */
export default function Home() {
  const [trips, setTrips] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [error, setError] = useState(null);
  const [lastFormData, setLastFormData] = useState(null);

  // Tracks the in-flight request so a stale response can never overwrite a
  // newer one (e.g. user clicks Generate twice in a row).
  const abortControllerRef = useRef(null);
  const requestIdRef = useRef(0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
  }, [trips]);

  const runGeneration = async (formData) => {
    // Cancel any previous in-flight request before starting a new one.
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const thisRequestId = requestIdRef.current + 1;
    requestIdRef.current = thisRequestId;

    setStatus("loading");
    setError(null);
    setLastFormData(formData);

    try {
      const rawItinerary = await generateTrip(formData, controller.signal);

      // If a newer request has started since this one began, discard this result.
      if (thisRequestId !== requestIdRef.current) return;

      const itinerary = parseItinerary(rawItinerary);
      setTrips((prev) => [itinerary, ...prev]);
      setStatus("success");
    } catch (err) {
      if (err.code === "CANCELLED") return; // superseded by a newer request
      if (thisRequestId !== requestIdRef.current) return;

      setError({ message: err.message, code: err.code });
      setStatus("error");
    }
  };

  const handleDeleteTrip = (index) => {
    setTrips((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateTrip = (index, updatedItinerary) => {
    setTrips((prev) => prev.map((trip, i) => (i === index ? updatedItinerary : trip)));
  };

  const handleRetry = () => {
    if (lastFormData) runGeneration(lastFormData);
  };

  return (
    <>
      <Hero />

      <main id="planner" className="mx-auto max-w-4xl px-6 py-16">
        <TripForm onSubmit={runGeneration} isLoading={status === "loading"} />

        <section className="mt-10 space-y-6">
          {status === "loading" && <Loading />}
          {status === "error" && <ErrorCard error={error} onRetry={handleRetry} />}
          {status === "idle" && trips.length === 0 && <EmptyState />}

          {trips.map((trip, index) => (
            <TripCard
              key={`${trip.tripTitle}-${trip.createdAt}-${index}`}
              itinerary={trip}
              onDelete={() => handleDeleteTrip(index)}
              onRegenerate={() => lastFormData && runGeneration(lastFormData)}
              onUpdateItinerary={(updated) => handleUpdateTrip(index, updated)}
            />
          ))}
        </section>
      </main>
    </>
  );
}
