const express = require("express");
const app = express();
const router = express.Router();

const tradeContoller = require("../Controllers/TradeController");

router.post("/viewStocks", tradeContoller.viewStocks);
router.post("/buyStock", tradeContoller.buyStock);
router.post("/sellStock", tradeContoller.sellStock);
router.post("/limitOrder", tradeContoller.limitOrder);
router.post("/viewOrder", tradeContoller.viewOrder);
router.post("/MatchOrder", tradeContoller.MatchOrder);
router.post("/viewAsk", tradeContoller.viewAsk);
router.post("/viewBid", tradeContoller.viewBid);


module.exports = router;
