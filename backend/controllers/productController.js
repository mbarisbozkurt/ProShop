import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/productModel.js";

//@desc: fetch all products
//@route: GET /api/products
//@access: public  
const getProducts = asyncHandler(async(req, res) => {
  const pageSize = 8; //how many products user will see

  //get from apiSlice
  const sortOrder = req.query.sortOrder;
  const page = Number(req.query.pageNumber) || 1; 
  const keyword = req.query.keyword 
  ? {name: {$regex: req.query.keyword, $options: "i"}} //regular expression: e.g: if product name is iPhone but user entered "Phone" it is ok. $options: "i": case insensitive
  : {};
  //console.log(sortOrder, page, keyword);

  const count = await Product.countDocuments({...keyword}); //number of products //{...keyword} spread whatever inside the keyword: name (product needs to be found) or {} (findAll)

  let sortCriteria = {}; 

  if (sortOrder === "ascending") {
    sortCriteria = {price: 1};
  } else if (sortOrder === "descending") {
    sortCriteria = {price: -1};
  }

  const products = await Product.find({...keyword}).limit(pageSize).skip(pageSize * (page-1)).sort(sortCriteria);
  if (!products || products.length === 0) {
      res.status(404);
      throw new Error("Resource not found");
  }else{
    res.status(200).json({products, page, pages: Math.ceil(count/pageSize)});
  }
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
    throw new Error("Resources not found"); //it is processed by errorHandler in middleware
  }
})

//@desc: create a product
//@route: POST /api/products
//@access: private/admin
const createProduct = asyncHandler(async(req, res) => {
  const product = new Product({
    user: req.user._id, //logged in user which is admin always
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
    throw new Error("Resource not found");
  }
})

//@desc: add a review to product
//@route: POST /api/products/:id/reviews
//@access: Private (only users should review)
const createProductReview = asyncHandler(async (req, res) => {
  const {rating, comment} = req.body;
  const product = await Product.findById(req.params.id);
  
  if(product){
    //find a review such that db.review == logged in user review stated in authMiddleware
    const alreadyReviewed = product.reviews.find((review) => review.user.toString() === req.user._id.toString()); 

    if(alreadyReviewed){
      res.status(400); //Bad request, already reviewed
      throw new Error ("Product already reviewed!");
    }

    const newReview = {
      user: req.user._id, //user info comes from protect middleware (authMiddleware.js line15)
      name: req.user.name, 
      rating: Number(rating),
      comment,
    };

    product.reviews.push(newReview);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((total, review) => review.rating + total, 0) / product.reviews.length;

    await product.save();
    res.status(201).json({message: 'Review added successfully'});

  } else {
    res.status(404);
    throw new Error('Resource not found');
  }
});

//@desc: get top rated products
//@route: GET /api/products/top 
//@access: public  
const getTopProducts = asyncHandler(async(req, res) => {
  const products = await Product.find({}).sort({rating: -1}).limit(3); //find all the products in the database and sort them in descending order
  res.status(200).json(products);
})

export {getProducts, getProductById, createProduct, updateProduct, deleteProduct, createProductReview, getTopProducts};