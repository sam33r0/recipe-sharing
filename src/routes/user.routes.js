import { Router } from "express";
import { changeCurrentPassword, getCurrentUser, loginUser, logoutUser, refreshAccessToken, register, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route('/').get((req, res) => {
    res.send("<h1>hello</h1>");
})

router.route('/register').post(upload.single("avatarLocalPath"), register)
router.route('/update-avatar').post(upload.single("avatarLocalPath"),verifyJWT, updateUserAvatar);


router.route('/login').post(loginUser);
router.route('/refresh-access-token').post(refreshAccessToken);

router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/current-user').post(verifyJWT, getCurrentUser);
router.route('/update-account-detail').post(verifyJWT, updateAccountDetails);
router.route('/logout').post(verifyJWT, logoutUser);


export default router;