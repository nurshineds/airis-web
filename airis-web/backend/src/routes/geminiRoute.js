const express = require("express");
const router = express.Router();
const geminiController = require("../controllers/geminiController");

router.post("/air-quality", geminiController.generateAirQuality);
router.post("/health-recom", geminiController.generateHealthRecom);

module.exports = router;