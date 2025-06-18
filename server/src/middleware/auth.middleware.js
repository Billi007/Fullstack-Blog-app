import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import APIError from '../utils/APIError.js'

const verifyJWT = async function (req,res,next){
   try {
    const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer ", "");
    if(!token){
      throw new APIError(401, 'Unauthorized request - No token provided')
    }
 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
     
    const user = await User.findById(decodedToken?._id).select("-password -confirmPassword -refreshToken");
     if(!user){
       throw new APIError(404, 'Invalid access token - User not found')
     }
     req.user = user;
     next();

   } catch (error) {
   throw new APIError(500, "Error verifying JWT " + error.message)
   }
}
export default verifyJWT;