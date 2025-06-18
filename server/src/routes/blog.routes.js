import { Router } from "express";
import {upload} from '../middleware/multer.middleware.js'
import { createBlog, deleteBlog, getAllBlog, getBlog, getBlogVisibilityCounts, getLikedBlog, hideBlog, LikedBlog, showBlog, updateBlog } from "../controllers/blog.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.post('/create', verifyJWT, upload.
fields([{name: "featuredImage", maxCount: 1}]), createBlog)
router.get('/all', getAllBlog)
router.get('/:id', verifyJWT, getBlog)
router.put('/update/:id', verifyJWT, upload.fields([{name: 'featuredImage'}]), updateBlog);
router.delete('/delete/:id', verifyJWT, deleteBlog)
router.patch('/hide/:id', verifyJWT, hideBlog)
router.patch('/show/:id', verifyJWT, showBlog)
router.post('/like/:id', verifyJWT, LikedBlog)
router.get('/like/all', verifyJWT, getLikedBlog)

export default router;