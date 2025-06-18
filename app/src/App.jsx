import { lazy, Suspense, useContext } from 'react'
import './App.css'
import Loading from './components/Loading'
import { ToastContainer } from 'react-toastify'
import { Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar'
import PrivateRoutes from './utils/PrivateRoutes'
import { UserContext } from './context/UserContext'
import LikedBlogs from './pages/LikedBlogs'

function App() {
  const Home = lazy(()=> import('./pages/Home'))
  const SignIn = lazy(() => import('./pages/SignIn'))
  const SignUp = lazy(() => import('./pages/SignUp'))
  const Create_blog = lazy(() => import('./pages/Create_blog'))
  const Blog = lazy(() => import('./pages/Blog'))
  const Dashboard = lazy(() => import('./pages/Dashboard'))

  const {user} = useContext(UserContext)

  return (
    <>
    {user?.user && <Navbar/> }
    <Suspense fallback={<Loading/>}>
    <ToastContainer
     position='top-right'
     autoClose={3000}
     hideProgressBar={false}
     newestOnTop={true}
     closeOnClick
     pauseOnFocusLoss
     draggable
     pauseOnHover
     theme='colored'
    />
    <Routes>
    <Route path='/' element={<PrivateRoutes><Home/></PrivateRoutes>} />
    <Route path='/signin' element={<SignIn/>} />
    <Route path='/signup' element={<SignUp/>} />
    <Route path='/blog/create' element={<PrivateRoutes><Create_blog/></PrivateRoutes>} />
    <Route path='/blog/:id' element={<PrivateRoutes><Blog/></PrivateRoutes>} />
     <Route path='/dashboard' element={<PrivateRoutes><Dashboard/></PrivateRoutes>} />
     <Route path='/blog/liked' element={<PrivateRoutes><LikedBlogs/> </PrivateRoutes>} />
    </Routes>
    </Suspense>
    </>
  )
}

export default App
