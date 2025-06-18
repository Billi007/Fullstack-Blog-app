import { Router } from "express";
import verifyAdmin from '../middleware/verifyadmin.middlware.js'
import { getAllBlog, getBlogVisibilityCounts } from "../controllers/blog.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import { adminDeleteUser, getAllUsers } from "../controllers/user.controller.js";

const router = Router();

//Blogs
//get all blogs
router.get('/blogs', verifyAdmin, getAllBlog)
//get all blog counts
router.get('/blogcounts', verifyJWT, verifyAdmin, getBlogVisibilityCounts)



//Users
//get all users
router.get('/users', verifyJWT, verifyAdmin, getAllUsers)
router.delete('/delete/:id', verifyJWT, verifyAdmin, adminDeleteUser)   


export default router