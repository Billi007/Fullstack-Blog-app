import axios from "axios";
import { toast } from "react-toastify";

export const HideBlog = async function(id, navigate){
    try {
    const confirm = window.confirm('Are you sure you want to Hide this blog?')
    if(!confirm) return;

    await axios.patch(`http://localhost:4000/api/v1/blog/hide/${id}`, {},
    {withCredentials: true})
    toast.success("Blog is hidden successfully!")
    navigate('/')

    } catch (error) {
    toast.error('Failed to hide blogs ', error.message)
    }
}