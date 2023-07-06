import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";

import users from "./data/users.js";
import products from "./data/products.js";

import User from "./models/userModel.js";
import Product from "./models/productModel.js";
import Order from "./models/orderModel.js";

import connectDB from "./config/db.js";
dotenv.config();

connectDB();

const importData = async() => {
  try {
    //first delete all
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    
    //insert users
    const createdUsers = await User.insertMany(users); 
    const adminUser = createdUsers[0]._id

    //get the products with admin 
    const sampleProducts = products.map((product) => {
      return {...product, user: adminUser}
    })

    //insert the products with admin
    await Product.insertMany(sampleProducts);

    console.log("Data imported!".green.inverse);
    process.exit();

  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
} 

const destroyData = async() => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();
    
    console.log("Data deleted!".red.inverse);
    process.exit();

  } catch (error) {
    console.error(`${error}`.red.inverse);
    process.exit(1);
  }
}

if(process.argv[2] === "-d"){
  destroyData();
}else{
  importData();
}