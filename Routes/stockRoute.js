const express = require("express");
const app = express();
const router = express.Router();

const stockController = require("../Controllers/StockController");

router.post("/listStock", stockController.listStock);
router.post("/updatePrice", stockController.updatePrice);
router.post("/stockTracker", stockController.stockTracker);
router.post("/fetchStockData", stockController.fetchStockData);

module.exports = router;
