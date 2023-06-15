const express = require("express");
const app = express();
const router = express.Router();

const tradeContoller = require("../Controllers/TradeController");

router.get("/viewStocks", tradeContoller.viewStocks);
router.post("/buyStock", tradeContoller.buyStock);
router.post("/sellStock", tradeContoller.sellStock);
router.post("/limitOrder", tradeContoller.limitOrder);
router.post("/askBid", tradeContoller.askBid);
router.post("/viewAsk", tradeContoller.viewAsk);
router.post("/viewBid", tradeContoller.viewBid);
router.post("/getBtcBalance", tradeContoller.getBtcBalance);
router.post("/swapBuy", tradeContoller.swapBuy);


module.exports = router;
