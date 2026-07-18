const express = require("express");
const { generateTrip } = require("../controllers/tripController");

const router = express.Router();

// POST /generate-trip - generates an AI itinerary from trip requirements
router.post("/generate-trip", generateTrip);

module.exports = router;
