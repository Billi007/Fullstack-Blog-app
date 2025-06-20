import axios from "axios";
import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { UserContext } from '../context/UserContext';
import { useNavigate, useParams } from "react-router-dom";
import { MdEditCalendar } from "react-icons/md";
import { MdDeleteOutline } from "react-icons/md";
import { DeleteBlog } from "../utils/DeleteBlog";
import { HiMenu, HiX } from "react-icons/hi";
import { BiSolidHide } from "react-icons/bi";
import UpdateBlog from "../utils/UpdateBlog";
import { HideBlog } from "../utils/HideBlog";
import { ShowBlog } from "../utils/ShowBlog";
import { BiShowAlt } from "react-icons/bi";

const Blog = () => {
  const [blog, setBlog] = useState([]);
  const [isOpen, setIsOpen] = useState(false)
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
      <div className="flex items-center justify-between gap-x-[600px]">
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
              <div className="relative">
               <button className="text-3xl p-2" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <HiX /> : <HiMenu />}
               </button>

               {isOpen && (
                <div className="absolute top-12 text-lg right-0 bg-white shadow-md rounded-md w-32 z-50">
                  <ul className="flex flex-col p-2 space-y-2 text-gray-800">
                    <li onClick={() => UpdateBlog(blog._id, navigate)} className="hover:bg-gray-100 flex items-center gap-2 p-1 rounded cursor-pointer">edit <MdEditCalendar/></li>
                    <li onClick={() => DeleteBlog(blog._id, navigate)}  className="hover:bg-gray-100 flex items-center gap-2 p-1 rounded cursor-pointer">delete <MdDeleteOutline/></li>
                    <li onClick={() => {
                    if(blog.isVisible)
                  {HideBlog(blog._id, navigate)
                  }else{
                  ShowBlog(blog._id, navigate)
                  }
                  }} 
                  className="hover:bg-gray-100 flex items-center gap-2 p-1 rounded cursor-pointer">
                  {blog.isVisible ? (<> hide <BiSolidHide /></>) : (<> show <BiShowAlt /></>)} </li>
                  </ul>
                </div>
               )}
              </div>
          </div>

        <div className="overflow-x-auto snap-x snap-mandatory flex gap-4 py-0">
          <img
            className="w-full max-w-4xl h-[600px] object-fill border p-1 snap-center shrink-0"
            src={blog.featuredImage?.url}
            alt=""
          />
        </div>

      <div className="space-y-10">
        <h1 className="text-4xl font-bold">{blog.title}</h1>
        <p className="text-black dark:text-white text-lg font-serif">{blog.description}</p>

        <p 
        dangerouslySetInnerHTML={{ __html: blog.content }}
        className="text-gray-700 dark:text-gray-300 bg-white text-lg font-serif space-y-4">
        </p>
      </div>
    </div>
  );
};

export default Blog;
