import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo connected " + conn.connection.host);
  } catch (error) {
    console.log("Error " + err);
  }
}

export default connectDB;