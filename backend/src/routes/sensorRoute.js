const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");

router.post("/add-sensor-data", sensorController.createSensorData);
router.get("/get-current-data", sensorController.getCurrentSensorData);
router.get("/get-today-data", sensorController.getTodaySensorData);

module.exports = router;