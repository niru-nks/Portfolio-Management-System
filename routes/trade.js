const validator = require('../middlewares/validator')
const router = require("express").Router();

const tradeController = require("../controllers/trade");

const { addSchema, updateSchema, deleteSchema } = require('../validations').trade


router.route('/get').get(tradeController.getTrades)
router.route('/add').post(validator(addSchema), tradeController.addTrade)
router.route('/update').post(validator(updateSchema), tradeController.updateTrade)
router.route('/delete').post(validator(deleteSchema), tradeController.deleteTrade)

module.exports = router;
