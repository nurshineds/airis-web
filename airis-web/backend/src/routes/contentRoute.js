const express = require("express");
const router = express.Router();
const contentController = require("../controllers/contentController");
// const { authAdmin } = require("../middleware/authMiddleware"); INI BENER TP GAUSA PAKE INI DULS YAW

router.get("/get-home-content", contentController.getHomeContent);
router.get("/get-content", contentController.getContentbyID);
router.post("/add-content", contentController.createContent);
router.post("/update-content", contentController.updateContent);
router.delete("/delete-content", contentController.deleteContent);

module.exports = router;

