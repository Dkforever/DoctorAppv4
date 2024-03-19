
const Order = require ("../models/orderModel");
const Product = require ("../models/products")
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");


// Create new Order
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
   paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    customer,
  } = req.body;

  const order = await Order.create({

    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    totalPrice,
    customer,
    paidAt: Date.now(),
  //  customer: req.customer._id,
  });

  res.status(201).json({
    success: true,
    order,
  });
});



// Get all orders admin
exports.getallOrders = catchAsyncErrors(async (req, res, next) => {
 
  const order = await Order.find();



  // to show admin All orders total Amount
  let totalAmount = 0;
   
  order.forEach((order) =>{
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    order,
  });
});


// get Single Order detail by admin 
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
 
  const order = await Order.findById(req.params.id).populate(
    "customer",
    "name email phone"
  );

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});




// My orders only for customer

exports.myOrders = catchAsyncErrors(async (req, res, next) => {
 
  const order = await Order.find({customer: req.customer._id});

  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});



// Update Order status

exports.updateOrderStatus = catchAsyncErrors(async (req, res, next) => {
 
  const order = await Order.findById(req.params.id);

  
  if (!order) {
    return next(new ErrorHander("Order not found with this Id", 404));
  }

  if (order.orderStatus === "delivered") {
    return next(new ErrorHandler("You have Already deliverd this order", 404));
  }

  order.orderItems.forEach(async(order) => {
     await updateStock(order.product, order.quantity);
  });
   
  order.orderStatus = req.body.status;

  if(req.body.status === "delivered"){
     order.deliveredAt = Date.now();
  }

  await order.save({validateBeforeSave: false});

  res.status(200).json({
    success: true,
    
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock -= quantity;
  await product.save({validateBeforeSave: false});
}


// deleter order by admin by oder id


exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
 
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

    await order.remove();

  res.status(200).json({
    success: true,
  
  });
});

