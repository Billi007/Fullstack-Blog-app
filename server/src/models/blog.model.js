import mongoose, { Schema } from "mongoose";

const BlogSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please enter the title."]
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: [true, "Please enter the author."]
    },
    description: {
        type: String,
        required: [true, 'Please enter the description.'],
        maxLength: [300, 'Description cannot exceed 100 characters']
    },
    content: {
        type: String,
        required: [true, 'Please enter the content.'],
        maxLength: [10000, 'Content cannot exceed 1000 characters']
    },
     isVisible: {
        type: Boolean,
        default: true
    },
    featuredImage: {
        url: {
            type: String,
            required: [true, 'Please enter the featured image.'],
            publicId: {type: String}
        }
    },
    isPublished: {
    type: Boolean,
    default: true
    },
    publishedAt: {
      type: Date,
      default: null
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'category',
    },
},{timestamps: true})

export const Blog = mongoose.model ('blog',BlogSchema);