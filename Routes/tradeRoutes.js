const express = require("express");
const app = express();
const router = express.Router();

const tradeContoller = require("../Controllers/TradeController");

router.get("/viewStocks", tradeContoller.viewStocks);
router.post("/buyStock", tradeContoller.buyStock);
router.post("/sellStock", tradeContoller.sellStock);
router.post("/limitOrder", tradeContoller.limitOrder);
router.get("/askBid", tradeContoller.askBid);
router.get("/viewAsk", tradeContoller.viewAsk);
router.get("/viewBid", tradeContoller.viewBid);


module.exports = router;
