const express = require("express");
const app = express();
const router = express.Router();
const auth = require("../Controllers/authMiddleware");
const { getUser } = require("../Controllers/userController");
const authController = require("../Controllers/AuthController");

router.post("/  ", authController.registerUser);
router.post("/loginUser", authController.loginUser);
router.post("/validate", authController.validate);
router.post("/updateProfile", authController.updateProfile);
router.post("/viewProfile", authController.viewProfile);
router.get("/user", auth, getUser);

module.exports = router;
