import mongoose from "mongoose";
import bcrypt from "bcryptjs"; 

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  }
}, 
{
  timestamps: true,
})

//compare the entered password (plaintext, string) with the password in the database (hashed password)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password); //this.password = password in the database (hashed)
}

//when user registers (userController.js --> registerUser()), before saving hash his/her password
userSchema.pre("save", async function(next) {
  if(!this.isModified("password")){
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
})

//Create the User table
const User = mongoose.model("User", userSchema);

export default User;