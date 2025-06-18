import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt'

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Please enter your Username."],
      unique: [true, "username should be unique"],
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },
    email: {
      type: String,
      required: [true, "Please enter your Email."],
      unique: [true, "Email already exists"],
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"],
    },
    avtar: {
      type: String,
      default: "default-avatar.jpg",
    },
    password: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      RegExp: [
        '"^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]{6}$"',
        "Password must be at least 6 characters with at least one letter and one number",
      ],
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    likedBlogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'blog',
    default: 0
    }],
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    refreshToken: {
      type: String,
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: function (el) {
        return el == this.password;
      },
      message: "Passwords do not match!",
    },
  },
  { timestamps: true }
);

UserSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, username: this.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRES }
  );
};
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });
};

export const User = mongoose.model("user", UserSchema);
