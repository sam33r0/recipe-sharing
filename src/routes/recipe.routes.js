import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addRecipe, allVissibleRecipe } from "../controllers/recipe.controller.js";


const router = Router();
router.route('/upload-recipe').post(upload.single("localImagePath"), verifyJWT, addRecipe)
router.route('/get-recipies').get(allVissibleRecipe);
export default router;