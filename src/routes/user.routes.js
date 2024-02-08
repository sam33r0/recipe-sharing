import { Router } from "express";
import { loginUser, logoutUser, register } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/').get((req, res) => {
    res.send("<h1>hello</h1>");
})

router.route('/register').post(upload.single("avatarLocalPath"), register)
router.route('/login').post(loginUser);
router.route('/logout').post(verifyJWT, logoutUser);
export default router;