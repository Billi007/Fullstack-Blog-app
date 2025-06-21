import { MdDeleteOutline } from "react-icons/md";
import { DeleteUser } from '../../utils/DeleteUser'
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";
import { FaUserEdit } from "react-icons/fa";

const UserList = () => {
  const [users, setUsers] = useState([])
  const navigate = useNavigate()
  const {user} = useContext(UserContext)
  //console.log('hello', user.user)

  useEffect(() => {
    const fetchUsers = async function(){
      try {
      const res = await axios.get('http://localhost:4000/api/v1/user/all', {withCredentials:true})
      setUsers(res.data.data.data)
      //console.log("ress",res.data.data.data)
      } catch (error) {
        toast.error('Failed to fetch users!', error.message)
        console.log("Error fetching users", error.message)
      }
    };

    fetchUsers()
  },[user, navigate])


 return (
 <div className=" overflow-x-auto rounded-box border-base-content/5 pt-28 px-10">
  <div>
    <h1 className='text-3xl dark:text-white mb-5 font-semibold'>Total Users ({users.length})</h1>
  </div>

   <div className="max-h-[300px] overflow-y-auto">
    <table className="table">
    <thead>
      <tr className='bg-gray-100 text-gray-900 dark:text-gray-100 dark:bg-slate-900'>
       
        <th>Name</th>
        <th>Email</th>
        <th>Last login</th>
        <th>Status</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
  {users.map((user) => (
      <tr key={user._id} className='border-b-[0.5px] border-gray-300 dark:border-slate-800'>
        
      <td>{user.username}</td>
      <td>{user.email}</td>
      <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "Never"} </td>
      <td className='text-green-500'>Visible</td>
      <td className='text-center text-xl flex gap-5' 
      onClick={() => DeleteUser(user._id, navigate)}>
      <MdDeleteOutline /> 
      <div><FaUserEdit /></div>
        </td>
      </tr>
    ))
    }
    
      
    </tbody>
  </table>
   </div>
</div>

  )
}

export default UserList
