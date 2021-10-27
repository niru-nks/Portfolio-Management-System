const mongoose = require("mongoose");

const tradeSchema = new mongoose.Schema({
  symbol: {
    type: String
  },
  price: {
    type: Number,
    min: 0
  },
  shares: {
    type: Number,
    min: 0
  },
  type: {
    type: String,
    enum: ['BUY', 'SELL']
  },
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("trade", tradeSchema);
