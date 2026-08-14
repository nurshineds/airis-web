const express = require("express");
const router = express.Router();
const sensorController = require("../controllers/sensorController");
 
router.post("/add-sensor-data", sensorController.createSensorData);
 
module.exports = router;