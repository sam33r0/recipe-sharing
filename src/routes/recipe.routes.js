import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { addRecipe, allEggRecipe, allNonVegRecipe, allVegRecipe, allVissibleRecipe, deleteRecipe, eggAndNonVegRecipe, eggAndVegRecipe, getMyRecipe } from "../controllers/recipe.controller.js";


const router = Router();
router.route('/upload-recipe').post(upload.single("localImagePath"), verifyJWT, addRecipe)
router.route('/delete-recipe').post(verifyJWT, deleteRecipe)

router.route('/my-recipes').get(verifyJWT, getMyRecipe);

router.route('/get-recipes').get(allVissibleRecipe);

router.route('/veg-recipes').get(allVegRecipe);
router.route('/nonveg-recipes').get(allNonVegRecipe);
router.route('/egg-recipes').get(allEggRecipe);
router.route('/egg-or-nonveg-recipes').get(eggAndNonVegRecipe);
router.route('/egg-or-veg-recipes').get(eggAndVegRecipe);
export default router;