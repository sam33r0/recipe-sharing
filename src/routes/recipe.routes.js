import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addRecipe, allEggRecipe, allNonVegRecipe, allVegRecipe, allVissibleRecipe, eggAndNonVegRecipe, eggAndVegRecipe } from "../controllers/recipe.controller.js";


const router = Router();
router.route('/upload-recipe').post(upload.single("localImagePath"), verifyJWT, addRecipe)
router.route('/get-recipies').get(allVissibleRecipe);
router.route('/veg-recipies').get(allVegRecipe);

router.route('/nonveg-recipies').get(allNonVegRecipe);
router.route('/egg-recipies').get(allEggRecipe);
router.route('/egg-or-nonveg-recipies').get(eggAndNonVegRecipe);

router.route('/egg-or-veg-recipies').get(eggAndVegRecipe);
export default router;