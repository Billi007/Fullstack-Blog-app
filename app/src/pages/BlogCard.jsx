import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BlogCard = ({ blog, currentUser, blogId }) => {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (currentUser?.user?.likedBlogs?.includes(blogId)) {
      setLiked(true);
    }
  }, [currentUser, blogId]);

  const likedBlogs = async function () {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/blog/like/${blogId}`,
        {},
        { withCredentials: true }
      );
      setLiked((prev) => !prev);
    } catch (error) {
      toast.error(error?.res?.data?.message || "Error liking blog");
    }
  };

  return (
    <>
      <div className="relative max-w-md bg-white dark:bg-black rounded-sm shadow-xl hover:shadow-2xl transition-transform duration-300 transform hover:-translate-y-2 group">
        <div>
          <img
            className="rounded-t-sm w-full max-h-64 object-cover"
            src={blog?.featuredImage?.url}
            alt="blog image"
          />
        </div>

        <div className="content px-5">
          <h3 className="text-2xl font-medium mt-3 cursor-pointer hover:text-blue-500">
            <Link to={`/blog/${blog._id}`}>{blog?.title}</Link>
          </h3>
          <p className="text-[16px] text-gray-700 dark:text-gray-400  my-5">
            {blog?.description}
          </p>

          <div className="border-t border-gray-400 border-opacity-80 w-full scale-y-50 origin-top"></div>

          <div className="flex items-center justify-between py-7">
            <div className="flex items-center gap-3">
              <img
                className="rounded-full w-12 h-12 object-cover"
                src={
                  currentUser?.user?.avtar ||
                  "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
                }
                alt="user"
              />
              <div className="flex-col items-center">
                <h3 className="font-semibold">
                  {currentUser?.user?.username || "Anonymous"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-300 ">
                  {new Date(blog?.createdAt).toLocaleString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true, // optional, for AM/PM
                  })}
                </p>
              </div>
            </div>

            {/* Liked blogs */}
            <div
              onClick={likedBlogs}
              className="text-lg text-blue-400 cursor-pointer"
            >
              {" "}
              {liked ? <FaHeart /> : <FaRegHeart />}{" "}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogCard;
