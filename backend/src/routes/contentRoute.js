//barang siapa. ya barang gweh 😹😐
const express = require("express");
const router = express.Router();

const contentController = require("../controllers/contentController");

//ini bener gini ga sih yang authAdmin? ^_____^
const { authAdmin } = require("../middleware/authMiddleware");

router.get("/get-content/:idContent", contentController.getContentbyID);
router.post("/add-content", authAdmin, contentController.createContent);
router.post("/update-content", authAdmin, contentController.updateContent);
router.post("/delete-content", authAdmin, contentController.deleteContent);

module.exports = router;

