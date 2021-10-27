const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
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
  active: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("portfolio", portfolioSchema);
