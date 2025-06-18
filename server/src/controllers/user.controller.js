import bcrypt from "bcrypt";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";
import {Blog} from '../models/blog.model.js'

//for admin only
const getAllUsers = async function (req, res) {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select("-password -confirmPassword -refreshToken --v")
      .lean();
    if (!users?.length) {
      throw new APIError(401, "No users found! ", []);
    }
   res.json( new APIResponse(200, { count: users.length, data: users }), "All users fetched succeefully!");
  } catch (error) {
    throw new APIError(500, "Failed to fetch users! " + error.message);
  }
};

const adminDeleteUser = async (req,res) => {
  const userId = req.params.id;

  try {
    if(!req.user.isAdmin){
      throw new APIError(403, "Unauthorized: Only admins can delete users")
    }

    const userToDelete = await User.findById(userId);
    if(!userToDelete){
      throw new APIError(403, "No user found!")
    }

    await Blog.deleteMany({author: userId})
    await User.findByIdAndDelete(userId)

    return res.json(
      new APIResponse(201, null, "User and all associated data deleted successfully")
    )
  } catch (error) {
    throw new APIError(501, "Failed to delete everything", error.message)
  }
}
  

//for users
const getUser = async function (req, res) {
  const userId = req.params.id;

  try {
    const user = await User.findById(userId)
      .sort({ createdAt: -1 })
      .select("-password -confirmPassword -refreshToken --v")
      .lean();

    if (!user) {
      throw new APIError(404, "No user found!");
    }

    res.json(new APIResponse(201, user, "User found!"));
  } catch (error) {
    throw new APIError(500, "Failed to find users! " + error.message);
  }
};

//Update user
const updateUser = async function (req, res) {
  try {
    const { password, username, email, confirmPassword } = req.body;
    const userId = req.user._id;

    if (password && password !== confirmPassword) {
      throw new APIError(401, "Passwords don't match! ");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new APIError(401, "User not found! ");
    }

    let avtarUrl = user.avtar?.url; // Keep existing if no new upload
    if (req.files?.avatar) {
      const avtarLocalPath = req.files.avtar[0]?.path;
      if (!avtarLocalPath) {
        throw new APIError(400, "Avatar file is required");
      }

      const avtar = await uploadOnCloudinary(avtarLocalPath);
      if (!avtar?.url) {
        throw new APIError(400, "Avtar not found! ");
      }
      avtarUrl = avtar.url;
    }

    const updatedFeild = {
      username: username || user.username,
      email: email || user.email,
      avtar: avtarUrl,
    };

    if (password) {
      updatedFeild.password = await bcrypt.hash(password, 10);
      updatedFeild.confirmPassword = updatedFeild.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedFeild },
      { new: true, runValidators: true }
    ).select("-password -confirmPassword -refreshToken");

    if (!updatedUser) {
      throw new APIError(404, "Updated user not found!");
    }

    res.json(new APIResponse(200,updateUser,"User updated successfully!"));
  } catch (error) {
    throw new APIError(500, "Failed to update user! " + error.message);
  }
};

//Delete user
const deleteUser = async function name(req, res) {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json(new APIResponse(200, [], "User has been deleted! "));
  } catch (error) {
    throw new APIError(500, "Failed to delete user! " + error.message);
  }
};
export { updateUser, deleteUser, getAllUsers, getUser, adminDeleteUser };
