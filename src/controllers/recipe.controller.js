import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { Recipe } from "../models/recipe.model.js"
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addRecipe = asyncHandler(async (req, res) => {
    const { name, ingredient, content, cookingTime, vissibility, category } = req?.body;
    const author = new mongoose.Types.ObjectId(req.user?._id);
    if (
        [name, content].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "incomplete data");
    }
    const localImagePath = req.file?.path;
    if (!localImagePath) {
        throw new ApiError(400, "no image is uploaded");
    }
    const image = await uploadOnCloudinary(localImagePath);
    if (!image) {
        throw new ApiError(400, "unable to upload image");
    }
    const recipe = await Recipe.create({
        name,
        ingredient,
        content,
        cookingTime,
        author,
        vissibility,
        image: image.url,
        category,
    })
    if (!recipe) {
        throw new ApiError(409, "unable to create entry in db");
    }
    return res.status(200).json(new ApiResponse(200, recipe, "checking"));
})

const allVissibleRecipe = asyncHandler(async (_, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                visibility: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const allVegRecipe = asyncHandler(async (req, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                category: "VEG",
                visibility: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const allNonVegRecipe = asyncHandler(async (req, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                category: "NONVEG",
                visibility: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const allEggRecipe = asyncHandler(async (req, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                category: "EGG",
                visibility: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const eggAndNonVegRecipe = asyncHandler(async (req, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                $or: [
                    {
                        category: "EGG"
                    },
                    { 
                        category: "NONVEG" 
                    }],
                visibility: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const eggAndVegRecipe = asyncHandler(async (req, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                $or: [
                    {
                        category: "EGG"
                    },
                    { 
                        category: "VEG" 
                    }],
                visibility: true
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const getMyRecipe = asyncHandler(async (req,res)=>{
    const id= req?.user?._id;
    if(!id)
    throw new ApiError(400,'no refresh token');
    const recipe= await Recipe.aggregate([{
        $match: {
            author: new mongoose.Types.ObjectId(id)
        }
    },{
        $project: {
            _id: 1,
            name: 1,
            author: 1,
            image: 1,
            category: 1
        }
    }])
    return res.status(200).json(new ApiResponse(200, recipe, 'These are your recipes'));
})

export {
    addRecipe,
    allVissibleRecipe,
    allVegRecipe,
    allNonVegRecipe,
    allEggRecipe,
    eggAndNonVegRecipe,
    eggAndVegRecipe,
    getMyRecipe
}