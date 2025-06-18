import mongoose, { Schema } from "mongoose";

const CategorySchema = new Schema({
    category: {
        type: String,
        required: [true, "Please enter the category name."],
        unique: true,
        trim: true
    }
},{timestamps: true})

export const Category = mongoose.model ('category', CategorySchema)