import Navbar from '../components/Navbar'
import BlogCard from './BlogCard'
import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext';
import axios from 'axios';

const Home = () => {
   const [blogs, setBlogs] = useState([]);
   const {user, setUser} = useContext(UserContext);
   //console.log("blog", blogs)

    useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/v1/blog/all', {
          withCredentials: true,
        });
        setBlogs(res.data.data);
        setUser(user)
        //console.log("Fetched blogs:", res.data.data);

      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };

    fetchAllBlogs();
  }, []); // <- empty dependency array is important


  const handleDelete = (id) => {
    setBlogs((prev) => prev.filter((blog) => blog._id !== id))
  }

  return (
    <>
     <div className='flex flex-wrap justify-center items-center  gap-x-10 gap-y-10 px-10 py-28'>
      {blogs.filter((blog) => blog.isVisible).length === 0 ? (
       <p className="text-xl text-gray-500 dark:text-gray-300">No blogs found.</p>
      ): 
      (blogs
      .filter((blog) => blog.isVisible)
      .map((blog) => (
          <div>
            <BlogCard 
            key={blog._id} 
            blog={blog} 
            blogId={blog._id}
            currentUser={user} 
            onDelete={handleDelete}
            />
          </div>
        ))
      )}

     </div>
    </>
  )
}

export default Home
