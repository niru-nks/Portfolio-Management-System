const router = require("express").Router();

const portfolioController = require("../controllers/portfolio");



router.route('/getPortfolio').get(portfolioController.getPortfolio)
router.route('/getReturns').get( portfolioController.getReturns)

module.exports = router;
