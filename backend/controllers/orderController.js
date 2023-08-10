import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/orderModel.js";
import Product from "../models/productModel.js";
import nodemailer from "nodemailer";

//@desc: Create new order
//@route: POST /api/orders
//@access: Private
const addOrderItems = asyncHandler(async(req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body; 

  if (orderItems && orderItems.length === 0){
    res.status(400);
    throw new Error ("No order item");
  }else{
    const order = new Order({
      orderItems: orderItems.map((item) => ({
        ...item,
        product: item._id, //determine the product in orderItems
        _id: undefined, //let db creates the id
      })),

      user: req.user._id, //req.user comes from the middleware, not from the frontend

      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});


//@desc: Get my orders
//@route: GET /api/orders/mine
//@access: Private
const getMyOrders = asyncHandler(async(req, res) => {
  const orders = await Order.find({user: req.user._id}); 
  res.status(200).json(orders);
})

//@desc: Get order by id
//@route: GET /api/orders/:id
//@access: Private
const getOrderById = asyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id).populate("user", "name email"); //get the name and email from the user collection
  if(order){
    res.status(200).json(order);
  }else{
    res.status(404);
    throw new Error("Order not found");
  }
})

//@desc: Update order to paid
//@route: PUT /api/orders/:id/pay
//@access: Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
  const order = await Order.findById(req.params.id);

  if(order){
    //update the new variables states in the model 
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = { 
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address, 
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  }else{
    res.status(404);
    throw new Error ("Order not found");
  }
})

//@desc: Update order to delivered
//@route: PUT /api/orders/:id/deliver
//@access: Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if(order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    //for all order in orderItems, update stock quantity 
    for(let i = 0; i < order.orderItems.length; i++) {
      const item = order.orderItems[i];
      const product = await Product.findById(item.product); //Find the product from database

      if(product) {
        product.countInStock -= item.qty; 

        if(product.countInStock < 0) { 
          product.countInStock = 0;
        }

        await product.save(); 
      }
    }

    const updatedOrder = await order.save();
    res.status(200).json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

//@desc: Get all orders
//@route: GET /api/orders
//@access: Private/Admin
const getOrders = asyncHandler(async(req, res) => {
  const orders = await Order.find({}).populate("user", "id name"); //get all orders and get id and name of the user in the db
  res.status(200).json(orders); //response
})

//@desc: Send order email
//@route: POST /api/orders/sendEmail
//@access: Private
const sendEmail = asyncHandler(async(req, res) => {
  const orderDetails = req.body;

  const generateOrderItemsHTML = (items) => {
    return items.map(item => `
      <li>
        <strong>Product Name:</strong> ${item.name} <br>
        <strong>Quantity:</strong> ${item.qty} <br>
        <strong>Price:</strong> $${item.price} 
      </li>
      <br>
    `).join(''); 
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      }
    });

    const message = {
      from: process.env.GMAIL_USER,
      to: `${orderDetails.user.email}`,
      subject: "Your Order Info",
      html: `
      <h2>Hello, ${orderDetails.user.name}.</h2>
      <p>Thank you for your order.</p>
      <h3>Order Details:</h3>
      <ul>
        ${generateOrderItemsHTML(orderDetails.orderItems)}
      </ul>
      <p><strong>Total Price:</strong> $${orderDetails.totalPrice}</p>
      <p><strong>Payment Method:</strong> ${orderDetails.paymentMethod}</p>
      <p><strong>Shipping Address:</strong> ${orderDetails.shippingAddress.address}, ${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.postalCode}, ${orderDetails.shippingAddress.country}</p>
       `
    };

    try {
      const info = await transporter.sendMail(message);
      console.log("Mail sent", info);
    } catch (error) {
      console.log(error, "error");
    }
    
    res.status(201).json({msg: "Email sent successfully"});
  } catch (error) {
    res.status(500).json({error: error.message});
  }

});

export{addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, updateOrderToDelivered, getOrders, sendEmail};