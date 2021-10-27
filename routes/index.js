const router = require("express").Router();
const tradeRoutes = require("./trade");
const portfolioRoutes = require("./portfolio");

router.use("/trade", tradeRoutes);
router.use("/portfolio", portfolioRoutes);

module.exports = router;
