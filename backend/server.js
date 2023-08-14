import path from "path";
import express from "express";
import dotenv from "dotenv"; //To be able to read the .env file with the .config() method and load the environmental variables in it into the process.env object
dotenv.config();
const port = process.env.PORT || 5000; //get the port from .env
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js"
import userRoutes from "./routes/userRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import uploadRoutes from "./routes/uploadRoutes.js"
import {notFound, errorHandler} from "./middleware/errorMiddleware.js"
import cookieParser from "cookie-parser"

connectDB();

const app = express();

//Body-parser middleware 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Cookie-parser middleware, allows to req.cookies.jwt (jwt is the name of the cookie) 
app.use(cookieParser());

app.use("/api/products", productRoutes); //after /api/products, no matter what is coming after that, go to productRoutes
app.use("/api/users", userRoutes); 
app.use("/api/orders", orderRoutes);
app.use("/api/upload", uploadRoutes);

app.get("/api/config/paypal", (req, res) => 
  res.send({clientId: process.env.PAYPAL_CLIENT_ID})
)

//to be able to upload image when admin edits the product, not that important
const __dirname = path.resolve(); //currenct directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));


//deploy to production
if(process.env.NODE_ENV === "production"){
  //If in production mode, serve the frontend's static build files
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  //any route that is not api will be redirected to index.html
  app.get("*", (req, res) => 
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}else{
  app.get("/", (req, res) => {
    res.send("API is running");
  })
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is running on " + port);
})

