import axios from "axios"
import { toast } from "react-toastify"



// const UpdateBlog = async function(id, updateData){
//     try {
//     const res = await axios.put(`http://localhost:4000/api/v1/blog/update/${id}`,updateData, 
//     {withCredentials: true})
//     toast.success("Blog updated successfully!")
//     return res.data.data;

//     } catch (error) {
//     toast.error('Error updating blogs ', error)
//     }
// }


export const DeleteUser = async function(id, navigate){
    try {
    const confirm = window.confirm('Are you sure you want to delete this User?')
    if(!confirm) return;

    await axios.delete(`http://localhost:4000/api/v1/user/delete/${id}`, 
    {withCredentials: true})
    toast.success("User deleted successfully!")
    navigate('/')

    } catch (error) {
    toast.error('Error deleting users ', error.message)
    }
}


