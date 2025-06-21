import axios from 'axios'
import React, { useEffect } from 'react'
import { toast } from 'react-toastify'

const EditUser = () => {
    useEffect(() => {
    const updateUser = async function(id){
     try {
    const res = await axios.put(`http://localhost:4000/api/v1/user/update/${id}`)
     } catch (error) {
      toast.error('Error updating user', error.message)
     }
    }
    updateUser()
    },[])
  return (
    <div>
      
    </div>
  )
}

export default EditUser
