import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";

//@desc: Auth(login) user and give a token to the user
//@route: POST /api/users/auth
//@access: Public  
const authUser = asyncHandler(async(req, res) => {
  const {email, password} = req.body; //req is made from postman for now 

  const user = await User.findOne({email}); //check if entered email is in the database

  if(user && (await user.matchPassword(password))){ //matchPassword function is in the userModel.js

    generateToken(res, user._id);
    
    //do not send any token back, it is going to get stored here and it will get sent with every subsequent request after login
    res.status(200).json({ //send back to the frontend (client, browser)
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  }else{
    res.status(401); //unauthorized
    throw new Error("Invalid email or password!");
  }
})

//@desc: Register
//@route: POST /api/users
//@access: Public  
const registerUser = asyncHandler(async(req, res) => {
  const {name, email, password} = req.body;
  
  const userExists = await User.findOne({email});
  if(userExists){
    res.status(400); //400: you did something wrong
    throw new Error("User already exists")
  }

  const user = await User.create({
    name,
    email,
    password //hashed in the userModel.js before saving, look at there
  })

  if(user){ //user is created successfully
    generateToken(res, user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  }else{
    res.status(400);
    throw new Error("Invalid user data!");
  }
})

//@desc: Logout user/clear cookie
//@route: POST /api/users/logout
//@access: Private
const logoutUser = asyncHandler(async(req, res) => {
  //clear cookie
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  })

  res.status(200).json({message: "Logged out successfully!"});
})

//@desc: Get user profile
//@route: GET /api/users/profile
//@access: Private
const getUserProfile = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);

  if(user){
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin
    })
  }else{
    res.status(404);
    throw new Error("User not found");
  }
})

//@desc: Update user profile
//@route: PUT /api/users/profile
//@access: Private
const updateUserProfile = asyncHandler(async(req, res) => {
  const user = await User.findById(req.user._id);

  if(user){
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    //if password is also changed
    if(req.body.password){
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    })
  }else{
    res.status(404);
    throw new Error("User not found");
  }
})

//@desc: Get users
//@route: GET /api/users
//@access: Private/Admin
const getUsers = asyncHandler(async(req, res) => {
  res.send("Get users");
})

//@desc: Get user by ID
//@route: GET /api/users/:id  
//@access: Private/Admin
const getUserByID = asyncHandler(async(req, res) => {
  res.send("Get user by id");
})

//@desc: Delete user
//@route: DELETE /api/users/:id 
//@access: Private/Admin
const deleteUser = asyncHandler(async(req, res) => {
  res.send("Delete user");
})

//@desc: Update user
//@route: PUT /api/users/:id 
//@access: Private/Admin
const updateUser = asyncHandler(async(req, res) => {
  res.send("Update user");
})

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserByID,
  deleteUser,
  updateUser,
}