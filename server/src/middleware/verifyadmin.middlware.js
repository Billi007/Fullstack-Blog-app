import { User } from "../models/user.model.js"
import APIError from "../utils/APIError.js"

const verifyAdmin = async function(req,res,next){
    const userId = req.user._id
    try {
    const user = await User.findById(userId)
    if(!user || user.role !== 'admin'){
      throw new APIError(403, "Unauthorized: Admin access required")
    }
    next();

    } catch (error) {
    next(new APIError(403, "error occured in admin middleware " + error.message))
    }
}

export default verifyAdmin