import axios from "axios";
import { toast } from "react-toastify";

export const ShowBlog = async function(id, navigate){
    try {
    const confirm = window.confirm('Are you sure you want to Show this blog?')
    if(!confirm) return;

    await axios.patch(`http://localhost:4000/api/v1/blog/show/${id}`, {},
    {withCredentials: true})
    toast.success("Blog is published successfully!")
    navigate('/')
    } catch (error) {
    toast.error('Failed to publish blogs ', error.message)
    }
}