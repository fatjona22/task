const {Product, validate} = require('../models/product');
const {Stock, validateStock} = require('../models/stock');

exports.createProduct = async function(req, res){
    const{error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 

    let product = new Product({
        name: req.body.name,
        images: req.files.map(file =>file.path),
        price: req.body.price,
        currency: req.body.currency,
        quantity: {
            initialQuantity: req.body.initialQuantity,
            stokQuantity:req.body.initialQuantity
        }
    });
    product = await product.save();
    res.send(product);
};
 
exports.getProducts = async function(req,res){
    try{
        const products = await Product.find();
        
        res.send(products);
    }   
    catch(ex){
        res.status(500).send('Something failed.');
    }
};  
//adding stock in an existing product 

exports.addstock = async function(req,res){
    const product = await Product.findByIdAndUpdate( {_id:req.params.id}, {$inc:{"quantity.stokQuantity": req.body.stok}}, {new:true});
    if(!product) return res.status(404).send('The product with the given ID was not found.')
    let stock = new Stock({
        product: product._id,
        user: req.user._id,     
        quantity: req.body.stok

    });
    await stock.save();
    res.send(product)
};     



//deleting a product 
exports.delete_product = async function(req,res){
    const product = await Product.findByIdAndDelete(req.params.id);
    if(!product) return res.status(404).send('The product with the given ID was not found.')
    res.send(product).status(200)

};