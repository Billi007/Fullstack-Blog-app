import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import {upload} from '../middleware/multer.middleware.js'
import verifyJWT from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register', upload.
fields([{name: "avtar", maxCount: 1}]), register)
router.post('/login', login)
router.post('/logout', verifyJWT, logout)

export default router;