const express = require("express");
const app = express();
const router = express.Router();

const authController = require("../Controllers/AuthController");

router.post("/registerUser", authController.registerUser);
router.post("/loginUser", authController.loginUser);
router.post("/validate", authController.validate);

module.exports = router;
