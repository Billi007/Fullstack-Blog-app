import { MdDeleteOutline } from "react-icons/md";
import { DeleteUser } from '../../utils/DeleteUser'
import { useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { UserContext } from "../../context/UserContext";

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
    <h1 className='text-3xl dark:text-white mb-5 font-semibold'>Total Users</h1>
  </div>
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
      <td>last login</td>
      <td className='text-green-500'>Visible</td>
      <td className='text-center text-xl' 
      onClick={() => DeleteUser(user._id, navigate)}>
      <MdDeleteOutline /> </td>
      </tr>
    ))
    }
    
      
    </tbody>
  </table>
</div>

  )
}

export default UserList
