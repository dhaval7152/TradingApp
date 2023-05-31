const express = require("express");
const app = express();
const router = express.Router();

const stockController = require("../Controllers/StockController");

router.post("/listStock", stockController.listStock);

module.exports = router;
