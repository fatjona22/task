const Joi = require('joi');
const mongoose = require('mongoose');
const validator = require('@hapi/joi');

const orderSchema = new mongoose.Schema({
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status: {
        type: String,
        default: "Created"
    },
    ordered: [{
        productId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
             required: true},
        quantity_ordered: {type: Number}
    }],
    date: {
        type: Date,
        default: Date.now() 
   }
});

const Order = mongoose.model('Order', orderSchema);

function validateOrder(order){
    const objectSchema = Joi.object().keys({
        productId: Joi.string().required(),
        quantity_ordered: Joi.number().required()
    })
    const schema = {
        ordered: Joi.array().items(objectSchema).required()
    }
    return Joi.validate(order, schema);
}


exports.orderSchema = orderSchema;
exports.Order = Order;
exports.validate = validateOrder