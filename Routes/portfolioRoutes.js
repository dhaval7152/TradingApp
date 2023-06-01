const express = require("express");
const app = express();
const router = express.Router();

const portfolioController = require("../Controllers/PortfolioContoller");

router.post("/viewPortfolio", portfolioController.viewPortfolio);

module.exports = router;
