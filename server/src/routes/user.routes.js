import { Router } from "express";
import {upload} from '../middleware/multer.middleware.js'
import verifyJWT from "../middleware/auth.middleware.js";
import { deleteUser, getUser, updateUser } from "../controllers/user.controller.js";

const router = Router();

router.get('/:id', verifyJWT, getUser)
router.put('/update/:userId', verifyJWT, upload.single('avtar'), updateUser)
router.delete('/delete/:id', verifyJWT, deleteUser)

export default router;