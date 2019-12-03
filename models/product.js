const Joi = require('joi');
const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    images: [{type: String, required: true}],
    price: {type: String, required: true},
    currency: {type:String,required:true},
    quantity: {
        stokQuantity: {type:Number, default: 0},
        initialQuantity: Number
    }
});

const Product = mongoose.model('Product', productSchema)

function validateProduct(product){
    const schema = {
        name: Joi.string(),
        price: Joi.string().required(),
        initialQuantity: Joi.string().required(),
        currency: Joi.string().required()
    }
    return Joi.validate(product, schema);
}

exports.productSchema = productSchema;
exports.Product = Product;
exports.validate = validateProduct;