import express from "express";
import dotenv from "dotenv"; //To be able to read the .env file with the .config() method and load the environmental variables in it into the process.env object
dotenv.config();
const port = process.env.PORT || 5000; //get the port from .env
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js"
import {notFound, errorHandler} from "./middleware/errorMiddleware.js"

connectDB();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running");
})

app.use("/api/products", productRoutes); //after /api/products, no matter what is coming after that, go to productRoutes

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log("Server is running on " + port);
})

