const trade = require('../models/trade');
const {addTradeValueToPortfolio,  updateTradeValueToPortfolio} = require('./portfolio')
// get all active trades
exports.getTrades = async (req, res) => {
  try {
    const trades = await trade.find({
      active: true
    });
    return res.json({
      "success": true,
      "msg": "Success",
      "data": {
        trades
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

// Add trade data BUY/SELL
exports.addTrade = async (req, res) => {
  try {
    const { symbol, price, shares, type } = req.body;

    const newTrade = new trade({ symbol, price, shares, type });
    await addTradeValueToPortfolio(req.body);
    const savedTrade = await newTrade.save();
    return res.json({
      "success": true,
      "msg": "Success",
      "data": {
        savedTrade
      }
    });
    
  } catch (err) {
    console.log(err);
    res.json({
      "success": false,
      "msg": "Internal server error",
      "data": {}
    });
  }
};

// Delete trade data (SOFT DELETE)
exports.deleteTrade = async (req, res) => {
  try {
    const {id} = req.body;
    let tradeData = await trade.findById(id);
    if (!tradeData || !tradeData.active) {
      return res.json({
        "success": false,
        "msg": "Data not found",
        "data": {}
      });
    }
    let otherTrades = await trade.find({
      symbol: tradeData.symbol, 
      _id: {
        $ne: tradeData._id
      },
      active: true
    });
    // Check if the state will be consistent after deletion and update portfolio
    await updateTradeValueToPortfolio(tradeData, otherTrades);
    tradeData.active = false;
    await tradeData.save();
    return res.json({
      "success": true,
      "msg": "Success",
      "data": {
        tradeData
      }
    })

  } catch (err) {
    console.log(err);
    res.json({
      "success": false,
      "msg": "Internal server error",
      "data": {}
    });;
  }
};

// Update trade data
exports.updateTrade = async (req, res) => {
  try {
    const {id, shares, price} = req.body;
    let tradeData = await trade.findById(id);
    if (!tradeData || !tradeData.active) {
      return res.json({
        "success": false,
        "msg": "Data not found",
        "data": {}
      });
    }
    let existingData = await trade.find({_id: {$ne: id}, active: true});
    if(shares) {
      tradeData.shares = shares;
      // if(!validate(existingData, tradeData)) {
      //   return res.json({ message: "Error: Negative shares" })
      // }
    }
    if(price) {
      tradeData.price = price;
    }
    // Check if the state will be consistent after updation and update portfolio
    await updateTradeValueToPortfolio(tradeData, [...existingData, tradeData])
    await tradeData.save();
    return res.json({
      "success": true,
      "msg": "Success",
      "data": {
        tradeData
      }
    })
  } catch (err) {
    console.log(err);
    return res.json({
      "success": false,
      "msg": "Internal server error",
      "data": {}
    });;
  }
};
