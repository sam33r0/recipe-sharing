import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { Recipe } from "../models/recipe.model.js"
import mongoose from "mongoose";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";

const addRecipe = asyncHandler(async (req, res) => {
    const { name, ingredient, content, cookingTime, visibility, category, image } = req?.body;
    const author = new mongoose.Types.ObjectId(req.user?._id);
    if (
        [name, content].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "incomplete data");
    }
    // const localImagePath = req.file?.path;
    // if (!localImagePath) {
    //     throw new ApiError(400, "no image is uploaded");
    // }
    // const image = await uploadOnCloudinary(localImagePath);
    // if (!image) {
    //     throw new ApiError(400, "unable to upload image");
    // }
    const recipe = await Recipe.create({
        name,
        ingredient,
        content,
        cookingTime,
        author,
        visibility,
        image: image.url,
        category,
    })
    if (!recipe) {
        throw new ApiError(409, "unable to create entry in db");
    }
    return res.status(200).json(new ApiResponse(200, recipe, "checking"));
})

const updateVissibility = asyncHandler(async (req, res) => {
    const id = req.body.id;
    const visibility= req.body.visibility;
    const recipe = await Recipe.findByIdAndUpdate(id,{
        $set: {
            visibility
    }},{new: true})
    return res.status(200).json(new ApiResponse(200, {}, "done"));
})

const allVissibleRecipe = asyncHandler(async (_, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                visibility: true
            }
        }, {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorName",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        avatar: 1,
                    }
                }]

            }
        }, {
            $addFields: {
                owner: {
                    $first: "$authorName"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1,
                owner: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const allVegRecipe = asyncHandler(async (_, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                category: "VEG",
                visibility: true
            }
        }, {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorName",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        avatar: 1,
                    }
                }]

            }
        }, {
            $addFields: {
                owner: {
                    $first: "$authorName"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1,
                owner: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const allNonVegRecipe = asyncHandler(async (_, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                category: "NONVEG",
                visibility: true
            }
        }, {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorName",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        avatar: 1,
                    }
                }]

            }
        }, {
            $addFields: {
                owner: {
                    $first: "$authorName"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1,
                owner: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const allEggRecipe = asyncHandler(async (_, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                category: "EGG",
                visibility: true
            }
        }, {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorName",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        avatar: 1,
                    }
                }]

            }
        }, {
            $addFields: {
                owner: {
                    $first: "$authorName"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1,
                owner: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const eggAndNonVegRecipe = asyncHandler(async (_, res) => {
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
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorName",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        avatar: 1,
                    }
                }]

            }
        }, {
            $addFields: {
                owner: {
                    $first: "$authorName"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1,
                owner: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const vegAndNonVegRecipe = asyncHandler(async (_, res) => {
    const recipes = await Recipe.aggregate([
        {
            $match: {
                $or: [
                    {
                        category: "VEG"
                    },
                    {
                        category: "NONVEG"
                    }],
                visibility: true
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorName",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        avatar: 1,
                    }
                }]

            }
        }, {
            $addFields: {
                owner: {
                    $first: "$authorName"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1,
                owner: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const eggAndVegRecipe = asyncHandler(async (_, res) => {
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
        }, {
            $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "authorName",
                pipeline: [{
                    $project: {
                        fullName: 1,
                        avatar: 1,
                    }
                }]

            }
        }, {
            $addFields: {
                owner: {
                    $first: "$authorName"
                }
            }
        },
        {
            $project: {
                _id: 1,
                name: 1,
                author: 1,
                image: 1,
                category: 1,
                owner: 1
            }
        }])
    if (recipes?.length == 0) {
        return res.status(200).json(new ApiResponse(200, {}, "no recipes found please start uploading"));
    }
    return res.status(200).json(new ApiResponse(200, { recipes }, "done"));
})

const getMyRecipe = asyncHandler(async (req, res) => {
    const id = req?.user._id;
    if (!id)
        throw new ApiError(400, 'no refresh token');
    const recipe = await Recipe.aggregate([{
        $match: {
            author: new mongoose.Types.ObjectId(id)
        }
    }, {
        $project: {
            _id: 1,
            name: 1,
            author: 1,
            image: 1,
            category: 1,
            visibility: 1
        }
    }])
    return res.status(200).json(new ApiResponse(200, recipe, 'These are your recipes'));
})

const deleteRecipe = asyncHandler(async (req, res) => {
    const { recId } = req.body;
    if (!recId) {
        throw new ApiError(400, 'no recipe id found');
    }
    const recipe = await Recipe.findByIdAndDelete(recId);
    if (!recipe) {
        throw new ApiError(500, 'unable to delete');
    }
    await deleteFromCloudinary(recipe.image);
    return res.status(200).json(new ApiResponse(200, recipe, 'deleted'));
})

const getRecipe = asyncHandler(async (req, res) => {
    const { recId } = req.body;
    if (!recId) {
        throw new ApiError(404, "no recipe found");
    }
    const recipe = await Recipe.findById(recId);
    if (!recipe) {
        throw new ApiError(404, "no recipe found");
    }
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(recipe.author) }, { avatar: 1, username: 1, fullName: 1 });
    if (!user) {
        return res.status(300).json(new ApiResponse(300, {
            recipe
        }, "Recipe Found but No User found"));
    }
    return res.status(200).json(new ApiResponse(200, {
        recipe, user
    }, "Recipe and Author Found"));
})

export {
    addRecipe,
    allVissibleRecipe,
    allVegRecipe,
    allNonVegRecipe,
    allEggRecipe,
    eggAndNonVegRecipe,
    eggAndVegRecipe,
    vegAndNonVegRecipe,
    getMyRecipe,
    deleteRecipe,
    getRecipe,
    updateVissibility
}