import express from "express";
import { signup, uploadVideoS3 } from "../Controller/userController.js";
import multer from 'multer';
const upload = multer();
const router = express.Router();

router.post("/signup",signup)
router.post("/uploadVideo",upload.single('file'),uploadVideoS3)


export default router;