const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");

router.post("/add-sensor-data", sensorController.createSensorData);
router.get("/get-current-data", sensorController.getCurrentSensorData);
router.get("/get-today-data", sensorController.getTodaySensorData);
router.post("/calculate-daily-ispu-average", sensorController.calculateDailyIspuAverage);
router.get("/get-daily-ispu-average", sensorController.getDailyIspuAverage);

module.exports = router;