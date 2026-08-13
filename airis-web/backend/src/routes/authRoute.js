// ini sebuah file
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/authController");
const { authAdmin } = require("../middleware/authMiddleware");

router.post("/signin-admin", adminController.signin);
router.post("/login-admin", adminController.login);
router.post("/logout-admin", adminController.logout);
router.post("/profile-admin", authAdmin, adminController.getProfileAdmin);

module.exports = router;