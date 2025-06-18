import { Navigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import React, { useContext, useEffect } from 'react'
import { toast } from 'react-toastify'

const PrivateRoutes = ({children}) => {
const {user} = useContext(UserContext)
const location = useLocation()

useEffect(() => {
if(!user?.user){
    toast.warn('Please login First!')
}
}, [location.pathname])



  return user?.user? children : <Navigate to='/signin' replace/>
}

export default PrivateRoutes
