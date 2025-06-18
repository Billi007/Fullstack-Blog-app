import { Blog } from "../models/blog.model.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import APIResponse from "../utils/APIResponse.js";
import APIError from "../utils/APIError.js";

const createBlog = async function (req, res) {
  try {
    const { title, content, isPublished, description } = req.body;
    if (!content || !title || !description) {
      throw new APIError(400, "All feilds are required! ");
    }

    const author = req.user;

    if (!author) {
      throw new APIError(404, "Author not found!");
    }

    // let categories = [];
    // if (category) {
    //   const categoryArray = Array.isArray(category)
    //     ? category
    //     : category.split(",").map((id) => id.trim());

    //   // Check if all categories exist
    //   const existingCategories = await Category.find({
    //     _id: { $in: categoryArray },
    //   });

    //   if (existingCategories.length !== categoryArray.length) {
    //     throw new ApiError(400, "One or more categories not found");
    //   }

    //   categories = categoryArray;
    // }

    const featuredImageLocalPath = req.files?.featuredImage[0]?.path;

    if (!featuredImageLocalPath) {
      throw new APIError(404, "FeaturedImage local path not found!");
    }

    const featuredImage = await uploadOnCloudinary(featuredImageLocalPath);
    if (!featuredImage) {
      throw new APIError(404, "Failed to upload Image on Cloudinary!");
    }

    const publishStatus = isPublished === "true";

    //const {accessToken} = await generateAccessAndRefreshToken(author._id)

    const accessToken = await author.generateAccessToken();
    const options = {
      httpOnly: true,
      secure: true,
    };

    const blog = new Blog({
      title,
      content,
      featuredImage,
      description,
      // categories,
      author: author._id,
      authorUsername: author.username,
      isPublished: publishStatus,
      publishedAt: publishStatus ? new Date() : null,
    });

    await User.findByIdAndUpdate(author._id, {
      $push: { blogs: blog._id },
    });
    const savedBlog = await blog.save();

    return res
      .cookie("accessToken", accessToken, options)
      .json(new APIResponse(201, "Blog created successfully!", savedBlog));
  } catch (error) {
    throw new APIError(500, "Failed to created blog! " + error.message);
  }
};

const getAllBlog = async function (req, res) {
  try {
    const blog = await Blog.find()
      .populate("author", "username avtar featuredImage content title")
      .sort({ createdAt: -1 });
    if (!blog) {
      throw new APIError(404, "No blog found!");
    }
     res.json(new APIResponse(200, blog, { count: blog.length }))
  } catch (error) {
    throw new APIError(500, "Failed to fetch blogs! " + error.message);
  }
};

const getBlog = async function (req, res) {
  try {
    const id = req.params.id;
    const blog = await Blog.findById(id);

    if (!blog) {
      throw new APIError(404, "No blog found!");
    }

    if(!id){
      throw new APIError(404, "Blog id not found!");
    }

     res.json(new APIResponse(200, blog, "Blog fetched!"))
  } catch (error) {
    throw new APIError(500, "Failed to fetch blog " + error.message);
  }
};

const updateBlog = async function (req, res) {
  const { title, content, isPublished, description } = req.body;
  console.log(req.body);
  const blogId = req.params.id;
  const userId = req.user?._id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new APIError(404, "No blog found!");
    }

    if (!blog.author.equals(userId)) {
      throw new APIError(403, "You can only update your own blogs!");
    }
    const imagePath = req.files?.featuredImage[0]?.path;

    if (!imagePath) {
      throw new APIError(404, "Image path not found!");
    }
    const featuredImage = await uploadOnCloudinary(imagePath);
    if (!featuredImage) {
      throw new APIError(404, "Failed to upload featured Image on Cloudinary!");
    }

    const updateData = {
      ...(title && { title }),
      ...(content && { content }),
       ...(description && { description }),
      ...(typeof isPublished === "boolean" && { isPublished }),
      ...(featuredImage && { featuredImage }),
      ...(isPublished && { publishedAt: new Date() }), // Update publish timestamp
    };
    const updatedBlog = await Blog.findByIdAndUpdate(
      blogId,
      { $set: updateData },
      { $new: true, runValidators: true }
    ).populate("author", "username email");

    res.json(new APIResponse(201,  updatedBlog, "Blog updated successfully!"));
  } catch (error) {
    throw new APIError(500, "Failed to update the blog! " + error.message);
  }
};



const deleteBlog = async function (req, res) {
  const blogId = req.params.id;
  const userId = req.user._id;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      throw new APIError(404, "No blog found!");
    }

    if (!blog.author?.equals(userId)) {
      throw new APIError(403, "You can only delete your own blogs!");
    }
    const deletedBlog = await Blog.findByIdAndDelete(blogId);

    await User.findByIdAndUpdate(
      userId,
      { $pull: { blogs: blogId } },
      { $new: true }
    );
    res.json(new APIResponse(200, blogId, "Blog deleted successfully!"));
  } catch (error) {
    throw new APIError(500, "Failed to delete blog " + error.message);
  }
};

const hideBlog = async (req,res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if(!blog){
      throw new APIError(404, "Blog not found!")
    }

    if(blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin){
      throw new APIError(403, "Unauthorized to hide this blog!")
    }
    blog.isVisible = false;
    await blog.save();

    return res.json(
      new APIResponse(200, [], "Blog hidden successfully")
    )
  } catch (error) {
    throw new APIError(501, "Failed to hide blog! " + error.message)
  }
}

const showBlog = async (req,res) => {
  const blogId = req.params.id;

  try {
    const blog = await Blog.findById(blogId);
    if(!blog){
      throw new APIError(404, "Blog not found!")
    }

    if(blog.author.toString() !== req.user._id.toString() && !req.user.isAdmin){
      throw new APIError(403, "Unauthorized to hide this blog!")
    }
    blog.isVisible = true;
    await blog.save();

    return res.json(
      new APIResponse(200, blog, "Blog published successfully")
    )
  } catch (error) {
    throw new APIError(501, "Failed to show blog! " + error.message)
  }
}

const getBlogVisibilityCounts = async (req, res) => {
  try {
    const [visibleCount, hiddenCount] = await Promise.all([
      Blog.countDocuments({isVisible: true}),
      Blog.countDocuments({isVisible: false})
    ])

    return res.json(
      new APIResponse(200, 
      {visibleBlogs: visibleCount,
       hiddenBlogs: hiddenCount, 
       totalBlogs: visibleCount+hiddenCount},
       "Blog visibility counts retrieved successfully")
    )
  } catch (error) {
    throw new APIError(501, null, "Failed to get blog counts: " + error.message)
  }
}


const LikedBlog = async (req, res) => {
  try {
  
  const userId = req.user._id;
  const blogId = req.params.id;

  const user = await User.findById(userId);
  const blog = await Blog.findById(blogId)

  if(!user || !blog){
    throw new APIError(404, "User or blog not found")
  }

  const alreadyLiked = user.likedBlogs.includes(blogId);

  if(alreadyLiked){
    user.likedBlogs = user.likedBlogs.filter(id => id.toString() !== blogId);
    blog.likes = Math.max(0, blog.likes - 1)
  }else{
    user.likedBlogs.push(blogId)
    blog.likes += 1;
  }

  await user.save();
  await blog.save();
    
  return res.status(200).json({
      message: alreadyLiked ? 'Blog unliked' : 'Blog liked',
      likedBlogs: user.likedBlogs,
      likes: blog.likes,
    });
    
  } catch (error) {
    throw new APIError(501, null, error.message)
  }
}

const getLikedBlog = async (req, res) => {
  try {
  
   const user =  await User.findById(req.user._id).populate('likedBlogs')

   if(!user){
    throw new APIError(404, 'User not found')
   }
    
     return res.json(
      new APIResponse(200, {likedBlogs: user.likedBlogs})
    )
    
  } catch (error) {
    throw new APIError(501, null, 'Failed to fetch liked blogs' + error.message)
  }
}
export { createBlog, getAllBlog, updateBlog, deleteBlog, getBlog, hideBlog, showBlog, getBlogVisibilityCounts, LikedBlog, getLikedBlog };
