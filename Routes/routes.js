const express = require("express");
const app = express();
const router = express.Router();

const DataController = require("../Controllers/MainController");

// router.post("/signUp", DataController.signUP);
router.post("/deposit", DataController.deposit);
router.post("/withdraw", DataController.withdraw);

module.exports = router;
