import { Link } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import React, { useContext } from 'react'

const Profile = () => {
const {user} = useContext(UserContext)
console.log('userrrr', user.user)
const defaultAvatar = "https://images.icon-icons.com/1378/PNG/512/avatardefault_92824.png";

  return (
    <div className='pt-40'>
    <div className='max-w-xl border rounded-sm bg-red-50 dark:bg-black flex justify-center gap-12 m-auto items-center p-10'>
     <div>
        <img 
        className='w-52'
        src={user?.user?.avtar || defaultAvatar} 
        alt="profile" />
     </div>
    
    <div>
     <p>{user?.user?.username}</p>
     <p>{user?.user?.email}</p>
     <p>role : {user?.user?.role}</p>
     <p>{new Date(user?.user?.createdAt).toLocaleDateString()}</p>
     <p className='hover:underline'>
      <Link to={`blog/hidden`}>Hidden Blogs</Link>
     </p>
    </div>
    </div>
    </div>
  )
}

export default Profile
