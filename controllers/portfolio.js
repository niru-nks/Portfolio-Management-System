const portfolio = require('../models/portfolio');
const { TRADE_TYPE, CURRENT_PRICE } = require('../utility/constants');

// get all active trades
exports.getPortfolio = async (req, res) => {
  try {
    const portfolioRecords = await portfolio.find({
      active: true,
      shares: {
        $gt: 0
      }
    });
    return res.json({
      "success": true,
      "msg": "Success",
      "data": {
        portfolioRecords
      }
    });
  } catch (err) {
    console.log(err);
    return res.json({
      "success": false,
      "msg": "Internal server error",
      "data": {}
    });
  }
};

// get returns
exports.getReturns = async (req, res) => {
  try {
    const portfolioRecords = await portfolio.find({
      active: true,
      shares: {
        $gt: 0
      }
    });
    let returns = 0;
    for(let i = 0;i<portfolioRecords.length;i++) {
      returns += ((CURRENT_PRICE-portfolioRecords[i].price)*portfolioRecords[i].shares)
    }
    return res.json({
      "success": true,
      "msg": "Success",
      "data": {
        returns
      }
    });
  } catch (err) {
    console.log(err);
    return res.json({
      "success": false,
      "msg": "Internal server error",
      "data": {}
    });
  }
};

// Update portfolio when a new trade is added.. Also check that the total shares dont go below 0
exports.addTradeValueToPortfolio = async (data) => {
  try {
    let { shares, price, symbol } = data;
    let portfolioRecord = await portfolio.findOne({ active: true, symbol });
    if (data.type == TRADE_TYPE.BUY && !portfolioRecord) {
      let newSymbol = new portfolio({ shares, price, symbol });
      let savedSymbol = await newSymbol.save();
      return savedSymbol;
    } else if (data.type == TRADE_TYPE.BUY) {
      let newPrice = ((portfolioRecord.price * portfolioRecord.shares) + (price * shares)) / (portfolioRecord.shares + shares);
      portfolioRecord.price = newPrice;
      portfolioRecord.shares = portfolioRecord.shares + shares;
      let savedPortfoliRecord = await portfolioRecord.save();
      return savedPortfoliRecord;
    } else if (!portfolioRecord || portfolioRecord.shares < shares) {
      throw new Error('Record not allowed')
    } else {
      portfolioRecord.shares = portfolioRecord.shares - shares;
      if(portfolioRecord.shares == 0) {
        portfolioRecord.price = 0;
      }
      let savedPortfoliRecord = await portfolioRecord.save();
      return savedPortfoliRecord;
    }
  } catch (err) {
    console.log(err);
    throw new Error("Internal server error");
  }
}

// Check if the updated data will be consistent
exports.updateTradeValueToPortfolio = async (data, otherTrades) => {
  try {
    let portfolioRecord = await portfolio.findOne({
      active: true,
      shares: {
        $gte: 0
      },
      symbol: data.symbol
    })
    if(!otherTrades || !otherTrades.length) {
      portfolioRecord.shares = 0;
      portfolioRecord.price = 0;
      let savedPortfolio = await portfolioRecord.save();
      return savedPortfolio;
    }
    let shares = 0;
    let price = 0;
    for(let i = 0;i<otherTrades.length;i++) {
      if(otherTrades[i].type == TRADE_TYPE.BUY) {
        price = ((price*shares)+(otherTrades[i].price*otherTrades[i].shares))/ (shares + otherTrades[i].shares);
        shares = shares + otherTrades[i].shares;
      } else {
        shares = shares - otherTrades[i].shares;
      }
    }
    if(shares<0) {
      throw new Error('Action Not allowed');
    } else {
      portfolioRecord.shares = shares;
      portfolioRecord.price = price;
      let savedPortfolio = await portfolioRecord.save();
      return savedPortfolio;
    }
  } catch (err) {
    console.log(err);
    throw new Error('Internal server error');
  }
}
