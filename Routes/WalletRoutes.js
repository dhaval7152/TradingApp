const express = require("express");
const app = express();
const router = express.Router();

const WalletController = require("../Controllers/WalletController");

// router.post("/signUp", DataController.signUP);
router.post("/deposit", WalletController.deposit);
router.post("/withdraw", WalletController.withdraw);
router.post("/getUserBalance", WalletController.getUserBalance);

module.exports = router;
