const express = require("express");
const app = express();
const router = express.Router();

const tradeContoller = require("../Controllers/TradeController");

router.post("/viewStocks", tradeContoller.viewStocks);
router.post("/buyStock", tradeContoller.buyStock);
router.post("/sellStock", tradeContoller.sellStock);

module.exports = router;
