import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const register= asyncHandler(async(req,res)=>{
// get user details from frontend,
    // validation- notE
    // check if already exist
    // check compulsory
    // upload to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response 
    // check for user creation
    // return res

    const avatarLocalPath = req.file?.path;
    const { username, email, fullName, dob, password}= req.body;
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "incomplete data");
    }
    const existedUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existedUser)
        throw new ApiError(409, "User already exist");
    
    if(!avatarLocalPath)
    throw new ApiError(409, "no dp to upload");
    
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    if (!avatar)
        throw new ApiError(400, "Avatar file is required");

    const user= await User.create({
        username,
        email,
        fullName,
        avatar,
        dob,
        password        
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!createdUser) { 
        throw new ApiError(500, "Something went wrong while registering the user"); 
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )

})


export {register};