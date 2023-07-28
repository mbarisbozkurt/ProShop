import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc: fetch all products
//@route: GET /api/products
//@access: public  
const getProducts = asyncHandler(async(req, res) => {
  const products = await Product.find({}); //findAll
  res.json(products);
})

//@desc: fetch a product
//@route: GET /api/products/:id 
//@access: public  
const getProductById = asyncHandler(async(req, res) => {
  const product = await Product.findById(req.params.id);

  if(product){
    return res.json(product);
  }else{
    res.status(404);
    throw new Error("Resources not found") //it is processed by errorHandler in middleware
  }
})

//@desc: create a product
//@route: POST /api/products
//@access: private/admin

//CHECK and go to frontend
const createProduct = asyncHandler(async(req, res) => {
  const product = new Product({
    user: req.user._id,
    name: "Sample name",
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    description: "Sample description",
    numReviews: 0,
    price: 0,
    countInStock: 0
  })  

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
})

//@desc: update product
//@route: PUT /api/products/:id
//@access: private/admin  
const updateProduct = asyncHandler(async(req, res) => {

  //get the data that will come from frontend (form)
  const {name, image, brand, category, description, price, countInStock} = req.body;

  //find the product
  const product = await Product.findById(req.params.id);

  //update the product
  if(product){  
    product.name = name;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.description = description;
    product.price = price;
    product.countInStock = countInStock;

    //save to database and respond to frontend
    const updatedProuct = await product.save();
    res.json(updatedProuct);
  }else{
    res.status(404);
    throw new Error ("Resource not found");
  }
})


//@desc: delete a product
//@route: DELETE /api/products/:id
//@access: Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
  //get the item 
  const product = await Product.findById(req.params.id);

  //delete the item
  if(product){
    res.status(200).json({message: "Item is deleted!"});
    await Product.deleteOne({_id: product._id});
  }else{
    res.status(404);
    throw new Error("Item could not be deleted");
  }
})

export {getProducts, getProductById, createProduct, updateProduct, deleteProduct};