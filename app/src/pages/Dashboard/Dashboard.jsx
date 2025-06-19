import React from 'react'
import UserList from './UserList'
import BlogList from './BlogList'

const Dashboard = () => {
  return (
    <div className='m-auto max-w-5xl'>
     <UserList/> 
     <BlogList/>
    </div>
  )
}

export default Dashboard
