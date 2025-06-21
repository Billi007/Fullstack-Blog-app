import { Router } from "express";
import {upload} from '../middleware/multer.middleware.js'
import verifyJWT from "../middleware/auth.middleware.js";
import { adminDeleteUser, getAllUsers, getUser, updateUser } from "../controllers/user.controller.js";
import verifyAdmin from "../middleware/verifyadmin.middlware.js";

const router = Router();

// for admin only
router.get('/all', verifyJWT, getAllUsers)
router.delete('/delete/:id', verifyJWT, verifyAdmin, adminDeleteUser)
//for users
router.get('/:id', verifyJWT, getUser)
router.put('/update/:id', verifyJWT, upload.single('avtar'), updateUser)

export default router;