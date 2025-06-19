import { UserContext } from '../context/UserContext';
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import BlogCard from './BlogCard';

const LikedBlogs = () => {
const [likedBlogs, setLikedBlogs] = useState([]);
const {user} = useContext(UserContext)

  useEffect(() => {
    const fetchLikedBlogs = async function(){
    try {
      const res = await axios.get('http://localhost:4000/api/v1/blog/like/all',
       {withCredentials: true})
       setLikedBlogs(res.data.data.likedBlogs)
    } catch (error) {
      toast.error(`Failed to load liked blogs: ${error.message}`)
    }
  }
   if(user) fetchLikedBlogs()
  }, [user])

  if(!user) return <p>Please login to view liked blogs.</p>

  return (
    <div className='flex justify-between flex-wrap gap-6 py-32 px-10'>
      {likedBlogs.length == 0 ? (
        <p className='m-auto grid items-center mt-[20%]'>No liked blogs yet!</p>
      )
      : (
      likedBlogs.map((blog) => (
      <BlogCard 
      blog={blog}
      currentUser={user}
      key={blog._id}/>
      ))
      )}
    </div>
  )
}

export default LikedBlogs
