const Joi = require('joi');
const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
   timestamp: {
       type: Date,
       default : Date.now(),
       required: true
    },
   product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
  },
  quantity:  Number

});

const Stock = mongoose.model('Stock', stockSchema)

function validateStock(stock){
    const schema = {
        quantity: Joi.number().required()
    }
    return Joi.validate(stock, schema);
}

exports.stockSchema = stockSchema;
exports.Stock = Stock;
exports.validateStock = validateStock;