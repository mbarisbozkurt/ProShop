import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/userModel.js";

//user is registered or not check(i.e check if user has a cookie)
const protect = asyncHandler(async(req, res, next) => {
  //get the token from the cookie
  let token;
  token = req.cookies.jwt;
  
  if(token){
    try {
      //decode the token to get the user id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password"); //user is determined with req.user and we are ready to go to the next middleware stated in userRoutes
      next(); //go to the next middleware function
    } catch (error) {
      console.log(error);
      res.status(401); 
      throw new Error("Not authorized, token failed") //errorHandler handles that
    }
  }else{
    res.status(401); //unauthorized
    throw new Error("Not authorized, no token") //errorHandler handles that
  }
})

//admin check
const admin = (req, res, next) => {
  if(req.user && req.user.isAdmin){
    next();
  }else{
    res.status(401); //unauthorized
    throw new Error("Not authorized as admin") //errorHandler handles that
  }
}

export {protect, admin};