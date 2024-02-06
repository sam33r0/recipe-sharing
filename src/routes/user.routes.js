import { Router } from "express";
import { register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();

router.route('/').get((req,res)=>{
    res.send("<h1>hello</h1>");
})

router.route('/register').post(upload.single("avatar") ,register)
export default router;