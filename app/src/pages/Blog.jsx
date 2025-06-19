import axios from "axios";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from '../context/UserContext';
import { useNavigate, useParams } from "react-router-dom";
import { MdEditCalendar } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { DeleteBlog } from "../utils/DeleteBlog";

const Blog = () => {
  const [blog, setBlog] = useState([]);
  const {user} = useContext(UserContext);
  const {id} = useParams();
  const navigate = useNavigate()


  //console.log("blog", blog);
  //console.log("user", user)

  useEffect(() => {
    const fetchBlog = async function () {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/blog/${id}`,
          { withCredentials: true }
        );
        setBlog(res.data.data);
      } catch (error) {
        toast.error("Error fetching blog ", error.message);
      }
    };

    fetchBlog();
  }, []);

  
    

  return (
    <div className="p-5 max-w-[900px] flex flex-col justify-center m-auto py-24 items-center space-y-10">
      <div>
        <div className="flex gap-3 py-3 items-center">
          <img
            className="rounded-full w-12 h-12 object-cover"
            src={
             user?.user?.avtar ||
              "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png"
            }
            alt="user"
          />
          <div>
            <p>{user?.user?.username} </p>
            <p className="text-sm">
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
              <div>
              <button 
              className="text-2xl cursor-pointer">
               <MdEditCalendar />
              </button>
   
              <button 
              className="text-2xl cursor-pointer"
              onClick={() => DeleteBlog(blog._id, navigate)}>
               <MdDeleteOutline />
              </button>
              </div>

        <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 py-0">
          <img
            className="w-full max-w-4xl h-[600px] object-fill snap-center shrink-0"
            src={blog.featuredImage?.url}
            alt=""
          />
        </div>
      </div>

      <div className="space-y-10">
        <h1 className="text-4xl font-bold">{blog.title}</h1>
        <p className="text-black dark:text-white text-lg font-serif">{blog.description}</p>

        <p 
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="text-gray-700 dark:text-gray-300 text-lg font-serif space-y-4">
        </p>
      </div>
    </div>
  );
};

export default Blog;
