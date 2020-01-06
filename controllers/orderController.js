const {Order, validate} = require('../models/order');
const{Product} = require('../models/product');
const{User}=require('../models/user')
const sendEmail = require('../middleware/sendEmail.js');
var async = require('async');
var decrementQuantity = require('../middleware/decrementQuantity')


exports.make_order = async function(req,res){
    const{error} = validate(req.body);
    if(error) return res.status(400).send(error.details[0].message); 
console.log(req.body.ordered)
   let order = new Order({
       
    orderedBy: req.user._id,
    ordered: req.body.ordered
    });
    order = await order.save();
    res.send(order);
};
//get the current user orders
exports.getMyOrders = async function(req,res){
    
   const orderedByMe = await Order.find({orderedBy: req.user._id});
   if(!orderedByMe) return res.status(404).send('The post with the given ID was not found.'); 
   res.send(orderedByMe);
};

//cancel the order if its status is still created
exports.cancel_order = async function(req,res){
   const orderToCancel = await Order.findById({_id: req.params.id});
   if(orderToCancel.status == 'Created'){   
   orderToCancel.markModified('status')
   orderToCancel._doc.status = 'Cancelled'
   await orderToCancel.save()
   return res.status(200).send('The order is cancelled');}
  else{res.status(400).send("The order can't be cancelled, because it is approved")}
   }

//get all the orders only by admin 
exports.get_orders = async function(req,res){
    try{
        const orders = await Order.find({$or:[{"status":"Approved"},{"status":"Created"}]});
        res.send(orders);
    }
    catch(ex){
        res.status(500).send('Something failed.');
    }
};



//approve an order with a certain id
exports.approve_order = async function(req,res){
 var productsToDecrease = []
 const orderToApprove = await Order.findOne({_id:req.params.id}).populate("ordered.productId").populate("orderedBy", "-password")

 if(orderToApprove.status == "Approved"){
   res.status(400).send('The order is already approved')
}else{
   if(orderToApprove.status == "Created"){
   var ordersInorder= orderToApprove.ordered;
   for(var i= 0;i<ordersInorder.length;i++){
    if(ordersInorder[i].quantity_ordered > ordersInorder[i].productId.quantity.stokQuantity) {
       return res.send('There is no stok left to approve this order')
    } 
       productsToDecrease.push({
         id: ordersInorder[i].productId._id,
         quantity: ordersInorder[i].quantity_ordered
      })
  }
//approve order after checking that there is enough stock for all orders inside the big order...
        orderToApprove.markModified('status')
        orderToApprove._doc.status = 'Approved'
         await orderToApprove.save();

      
    
//send email to customer    
     var mail = orderToApprove.orderedBy.email
     async.parallel([
            function (callback) {
              sendEmail(
                callback,
                "fatjona.sheraj975@gmail.com",//email from where email are send
                [mail,"fatjona.sheraj@hotmail.com"],//emails to where email are send
                'Order Approved',
                'Text Content',
                '<p style="font-size: 32px;">Your order is approved. It will get soon to you!</p>'
              );
            }
          ], function(err, results) {
           return res.send({
              success: true,
              message: 'Emails sent'
            });
          });
//decrement stock quantity after the order is approved
   decrementQuantity(productsToDecrease);
 }
}
};