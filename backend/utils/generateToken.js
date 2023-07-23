import jwt from "jsonwebtoken";

const generateToken = (res, userId) => {
  //create token (***userid is the payload, JWT_SECRET is the key to be able to create token, expiresIn is the time that this token is valid)
  const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "30d"});

  //set this token (jason web token) into http only cookie 
  //jwt is the name of the cookie, token is the token created 
  //httpOnly: It cannot be read by JavaScript, so the cookie can only be accessed via HTTP
  //secure: process.env.NODE_ENV !== "development" indicates that the cookie will be sent over HTTPS only 
  //but this setting is valid only when the application is not in development mode. This is important to avoid cookie hijacking.
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict", //to be more secure
    maxAge: 30 * 24 * 60 * 60 * 1000 //30 days
  })
}

export default generateToken;