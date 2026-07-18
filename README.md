# Wandering Souls

A full-stack, AI-powered trip planner. Describe your trip in your own words — like you'd tell a friend — and the app turns it into a complete, editable, day-by-day itinerary using the Google Gemini API.

This is **not** a chatbot — Gemini is prompted to return structured JSON only, which React parses and renders as interactive itinerary cards (expandable days, add/edit/delete/reorder stops, copy/download, etc).

---

## 1. Project Overview

- **Frontend**: React (Vite) + Tailwind CSS, calling the backend through a single Axios service layer.
- **Backend**: Node.js + Express, which builds a prompt from the user's free-form description (plus any optional structured constraints), calls Gemini, cleans/validates the response, and returns it to the client.
- **AI**: Google Gemini (`gemini-1.5-flash` by default), instructed to return raw JSON matching an exact schema.

The Gemini API key never reaches the browser — all AI calls happen server-side.

---

## 2. Features

- **Free-form trip input**: a single textarea where you describe the trip however you'd say it out loud ("10 days backpacking through Vietnam, tight budget, love street food"). The AI reads the description and infers destination, length, pace, and interests itself.
- **Optional "fine-tune" section**: collapsible structured fields (exact day count, budget tier, travel type, interest tags, extra notes) that layer on top of the description as explicit constraints, for when you want to pin something down precisely.
- AI-generated, day-by-day itinerary rendered as expandable accordions
- Per-stop **add**, **edit**, **delete**, **move up/down** — every day is fully interactive, not just a static readout
- Copy itinerary as plain text, download as JSON
- Regenerate / generate-again flow
- Trips saved to `localStorage` and restored on reload
- Loading state with animated spinner and disabled submit button
- Empty state before any itinerary exists
- Friendly error cards (network error, timeout, malformed AI response, validation error) with a retry button
- Stale-request protection: if you click "Generate" again before the first call finishes, the earlier request is aborted/ignored so it can never overwrite the newer result
- Responsive layout (mobile / tablet / desktop)
- Dark mode toggle
- Glassmorphism cards, gradient accents, subtle motion (Framer Motion)

---

## 3. Tech Stack

| Layer     | Technology                                   |
|-----------|-----------------------------------------------|
| Frontend  | React (Vite), JavaScript, Tailwind CSS, Axios, React Icons, Framer Motion |
| Backend   | Node.js, Express, dotenv, cors               |
| AI        | Google Gemini API (`@google/generative-ai`)  |
| Deployment| Vercel (frontend), Render (backend)          |

---

## 4. Project Structure

```
wandering-souls/
├── client/
│   ├── src/
│   │   ├── components/       # Navbar, Hero, TripForm, TripCard, DayAccordion,
│   │   │                       ActivityCard, Loading, Error, EmptyState
│   │   ├── pages/Home.jsx    # Orchestrates form + itinerary state
│   │   ├── services/api.js   # Single Axios layer, never called directly in components
│   │   ├── utils/            # parseResponse.js, validateTrip.js
│   │   ├── App.jsx, main.jsx, index.css
│   ├── index.html, tailwind.config.js, vite.config.js, postcss.config.js
│   └── package.json
├── server/
│   ├── routes/trip.js
│   ├── controllers/tripController.js   # validation + error-code -> HTTP status mapping
│   ├── services/geminiService.js       # prompt builder + Gemini call + timeout
│   ├── utils/cleanJson.js              # strips markdown fences, extracts JSON, parses
│   ├── app.js
│   └── package.json
└── README.md
```

---

## 5. Installation

### Prerequisites
- Node.js 18+
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Backend

```bash
cd server
npm install
cp .env.example .env
# edit .env and paste your GEMINI_API_KEY
npm start        # or: npm run dev
```

### Frontend

```bash
cd client
npm install
cp .env.example .env
# VITE_API_URL should point at your backend (default http://localhost:5000)
npm start         # or: npm run dev
```

Visit `http://localhost:5173`.

---

## 6. Environment Variables

**server/.env**
```
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
```

**client/.env**
```
VITE_API_URL=http://localhost:5000
```

---

## 7. How to Run

1. Start the backend: `cd server && npm start` (listens on `http://localhost:5000`)
2. Start the frontend: `cd client && npm start` (listens on `http://localhost:5173`)
3. Open the app, describe your trip in the free-form box, click **Generate itinerary**.

---

## 8. Deployment

### Backend → Render
1. Push the repo to GitHub.
2. In Render, create a new **Web Service** pointed at the `server/` directory.
3. Build command: `npm install`. Start command: `npm start`.
4. Add environment variables `GEMINI_API_KEY`, `GEMINI_MODEL`, `CLIENT_ORIGIN` (your Vercel URL) in the Render dashboard.

### Frontend → Vercel
1. Import the repo into Vercel, set the root directory to `client/`.
2. Framework preset: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Add environment variable `VITE_API_URL` = your Render backend URL.

---

## 9. AI Usage Note

- **What the AI generates**: the backend sends Gemini a single prompt containing the user's free-form description verbatim, plus any optional structured constraints (exact day count, budget, travel type, interests, notes) the user chose to fill in, and a strict JSON schema. Gemini is explicitly told not to return markdown, code fences, or explanations — only the JSON object.
- **`responseMimeType: "application/json"`** is used as an extra guardrail on top of the prompt instructions.
- Even so, `utils/cleanJson.js` defensively strips any ` ```json ` fences and extracts the first balanced JSON object from the raw text before parsing — because LLM output should never be trusted to be 100% clean.
- `tripController.js` then validates the *shape* of the parsed object (title, summary, days array, activities arrays) before it's ever sent to the client. If the shape is wrong, the client shows a friendly retry card instead of crashing.
- **AI coding assistance**: an AI coding assistant (Claude) was used to help scaffold components, write the defensive JSON-cleaning/validation utilities, and refactor the trip form from a purely structured form into a free-form-first design with an optional "fine-tune" section. All resulting code was reviewed, and can be explained and extended live.

---

## 10. Known Limitations

- No user authentication — trips are stored per-browser in `localStorage`, not in a database.
- No streaming; the full itinerary is generated in a single request/response.
- Gemini output quality varies by how specific the description is — vague descriptions get more generic itineraries.
- "Add a stop" inserts a placeholder stop the user fills in manually; it doesn't call the AI again for just that one stop.
- No automated tests included (manual/unit-style checks were used during development).

---

## 11. Time Spent

Roughly within the ~8 hour target: initial scaffolding and Gemini integration, defensive JSON parsing/validation, interactive itinerary UI (accordions, per-stop edit/reorder/delete/add), loading/error/empty states, responsive + dark-mode styling, and this README.

---

## 12. Future Improvements

- Persist trips to a real database (e.g. PostgreSQL/MongoDB) with user accounts.
- Stream the itinerary as it's generated instead of waiting for the full response.
- Let "Add a stop" ask the AI to suggest a stop that fits the day, rather than a blank placeholder.
- Add map integration (pins per activity) and a real weather widget using a weather API.
- Multi-language support.
- Cache repeated identical requests to reduce API cost.
