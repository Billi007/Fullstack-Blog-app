import { DeleteBlog } from '../../utils/DeleteBlog'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { MdDeleteOutline } from "react-icons/md";

const BlogList = () => {
    const [blogs, setBlogs] = useState([])

    useEffect(() => {
    const fetchBlogs = async function(){
    try {
    const res = await axios.get('http://localhost:4000/api/v1/blog/all', {withCredentials: true})
     setBlogs(res.data.data)
    } catch (error) {
        console.log("err", error.message)
    }}
    fetchBlogs()
    },[])

  return (
    <div className="overflow-x-auto rounded-box border-base-content/5 py-24 px-10">
  <div>
    <h1 className='text-3xl dark:text-white mb-5'>Total Blogs</h1>
  </div>
  <table className="table">
    {/* head */}
    <thead>
      <tr className='bg-gray-100 text-gray-900 dark:text-gray-100 dark:bg-slate-900'>
       
        <th>Title</th>
        {/* <th>Description</th> */}
        <th>Author</th>
        <th>Created at</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
        
    {blogs.map((blog) => (
      <tr key={blog._id} className='border-b-[0.5px] border-gray-300 dark:border-slate-800'>
        <td>{blog.title} </td>
        {/* <td>{blog.description} </td> */}
        <td>{blog.author?.username || 'N/A'} </td>
        <td>{new Date(blog.createdAt).toLocaleDateString()} </td>
        <td className='text-green-600'>Visible</td>
        <td className='text-center text-xl' onClick={DeleteBlog}><MdDeleteOutline /> </td>
      </tr>
        ))}
    </tbody>
  </table>
</div>
  )
}

export default BlogList
