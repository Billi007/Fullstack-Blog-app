import { User } from "../models/user.model.js";
import bcrypt from 'bcrypt'
import uploadOnCloudinary from "../utils/cloudinary.js";
import APIError from '../utils/APIError.js'
import APIResponse from '../utils/APIResponse.js'

//generating access and refresh token
const generateAccessAndRefreshToken = async function(userId){
   try {
      //Find user by id
      const user = await User.findById(userId);

      //Generate access and refresh token
      const accessToken = await user.generateAccessToken()
      const refreshToken = await user.generateRefreshToken()

      //Update user with refresh token
      user.refreshToken = refreshToken
      await user.save()

      return {refreshToken, accessToken}

   } catch (error) {
      throw new APIError(500, "Something went wrong while generating Refresh and Access token " + error.message)
   }
}

//register user
const register = async (req,res,next) => {
    const {username, email,password,confirmPassword} = req.body;

    try {
      //checking if the all fields are filled
     if(!username || !email || !password || !confirmPassword){
       throw new APIError(400, 'All fields are required!')
     }

     //checking if the password and confirm password are same
     if (password !== confirmPassword) {
        throw new APIError(400, 'Password do not match!')
      }

      //checking if the email already exists
     const existingUser = await User.findOne({email})
     if(existingUser){
        throw new APIError(409, 'Email already exists!')
     }

     //getting the local path of the image
     const avtarLocalpath = req.files?.avtar[0]?.path;
     if(!avtarLocalpath){
      throw new APIError(409, 'Avatar local path not found!')
  }

     //uploading image to cloudinary
     const avtar = await uploadOnCloudinary(avtarLocalpath)

     if(!avtar){
       throw new APIError(409, 'Failed to upload image to Cloudinary!')
     }


     //hashing the password
     const hashPassword = async (password) => {
        return await bcrypt.hash(password,10);
     }
     const hashedPassword = await hashPassword(password);
  
     //creating the user
     const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        avtar: avtar.url,
     })

     //removing password filed from databse
    const createdUser = await User.findById(newUser._id).select('-password -confirmPassword');
     return res.status(201).json(
      new APIResponse(200, createdUser, "User registered successfully!")
     )

    } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message || "Something went wrong"
      })
    }
};


//login user
const login = async (req,res) => {
   const {email,password} = req.body;

   try {
   //checking if the all fields are filled
   if(!email && !password){
      throw new APIError(401, "All fields are required!")
   }

   //checking if the email already exists
   const user = await User.findOne({email});
   if(!user){
   throw new APIError(404, "No user found with this email!")
   }
   //checking if the password is correct
   const isPasswordCorrect = await bcrypt.compare(password, user.password);
   if(!isPasswordCorrect){
      throw new APIError(401, "Invalid user credentials!")
   }

   user.lastLogin = new Date();
   await user.save();

   //get refresh and access token
   const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user._id);

   //remove password and confirm password from user object
   const loggedInUser = await User.findById(user._id).select('-password -confirmPassword -refreshToken');
   
   const options = {
      httpOnly: true,
      secure: true,
   }
   
   return res.
   status(201).
   cookie('accessToken', accessToken, options)
   .cookie('refreshToken', refreshToken, options)
   .json(
      new APIResponse(200, {user: loggedInUser,accessToken,refreshToken}, "User logged in successfully!")
   )

   } catch (error) {
      res.status(500).json({
         success: false,
         message: error.message || "Something went wrong"
      })
   }
};


//logout user
const logout = async (req,res) => {

try {
   await User.findByIdAndUpdate(req.user._id,
   {$set: {refreshToken: undefined}},
   {new: true}
)

const options = {
   httpOnly: true,
   secure: true,
}

return res
.clearCookie("accessToken", options)
.clearCookie("refreshToken", options)
.json(
   new APIResponse(201, "User logged out successfully!")
)

} catch (error) {
  res.status(500).json({
      success: false,
      message: error.message || "Something went wrong"
   })
}
}

export {register,login,logout,generateAccessAndRefreshToken}