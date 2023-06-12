const express = require("express");
const app = express();
const router = express.Router();

const stockController = require("../Controllers/StockController");

router.post("/listStock", stockController.listStock);
router.post("/updatePrice", stockController.updatePrice);

// below api not in use
router.post("/stockTracker", stockController.stockTracker);
router.post("/fetchStockData", stockController.fetchStockData);
router.post("/viewCoin", stockController.viewCoin);

module.exports = router;
