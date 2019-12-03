const {Product} = require('../models/product')
module.exports = async function (productsToDecrease){

    for(var i =0; i<productsToDecrease.length;i++) {
        await Product.findOneAndUpdate({_id: productsToDecrease[i].id }, {$inc:{"quantity.stokQuantity" : -productsToDecrease[i].quantity}}, {new:true});
    }
}