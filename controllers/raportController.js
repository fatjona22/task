const {Order} = require('../models/order');
const moment = require('moment');

exports.get_raport = async function(req,res){
    
    var raportDate = req.body.date;
    var startRaportDate = moment(raportDate).startOf("day");
    var endRaportDate = moment(raportDate).endOf("day");
    console.log(raportDate, startRaportDate,endRaportDate)
    const orders = await Order.find( {$or: [{"status":"Approved"},{"status":"Created"}],
                                 "date":{"$gte": startRaportDate, "$lte": endRaportDate},
                                  })
    .populate("ordered.productId");
    var createdOrders = orders.filter(order => order.status == "Created");
    var approvedOrders = orders.filter(order => order.status == "Approved");
    var createdOrdersProducts = {};
    var approvedOrdersProducts = {};

   groupProducts(createdOrders,createdOrdersProducts)
   groupProducts(approvedOrders,approvedOrdersProducts)
   findTotal(createdOrdersProducts)
   findTotal(approvedOrdersProducts)
   var GrandTotal = findGrandTotal(approvedOrdersProducts)
   createdOrdersProducts = display(createdOrdersProducts)
   approvedOrdersProducts = display(approvedOrdersProducts)
   
   res.json({GrandTotal,createdOrdersProducts,approvedOrdersProducts})
};

function groupProducts (orders,groupProduct){
    orders.forEach(order =>{ 
        order.ordered.forEach(product => {
            if(groupProduct[product.productId._id]){
                groupProduct[product.productId._id].sasi += product.quantity_ordered;
            }else{
                groupProduct[product.productId._id]={
                    emer: product.productId.name,
                    sasi: product.quantity_ordered,
                    cmim: product.productId.price
                }
            }
        })
    } )
}

function findTotal(orderedProducts){
   Object.entries( orderedProducts).forEach(([productId,productObject]) => 
                      productObject.total = productObject.sasi*productObject.cmim)
}

function findGrandTotal(orders){
    var GrandTotal = 0;
    Object.entries( orders).forEach(([productId,productObject]) => 
                    GrandTotal += productObject.total)
                    return  GrandTotal;
}
function display(products){
    var display = [];
    Object.entries(products).forEach(([productId,productObject]) => 
                    display.push(productObject));
                    return display;
}



 