import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const register = asyncHandler(async (req, res) => {
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
    const { username, email, fullName, dob, password } = req.body;
    if (
        [fullName, email, username, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "incomplete data");
    }
    const lowerCaseUserName = username.toLowerCase();
    const existedUser = await User.findOne({
        $or: [{ lowerCaseUserName }, { email }]
    })

    if (existedUser)
        throw new ApiError(409, "User already exist");

    if (!avatarLocalPath)
        throw new ApiError(409, "no dp to upload");

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    if (!avatar)
        throw new ApiError(400, "Avatar file is required");
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        avatar: avatar.url,
        dob,
        password,
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

const generateToken = async (user) => {
    try{
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }
    }
    catch (error) {
        throw new ApiError(500, "Something went wrong while generating access and refresh token");
    }
}

const loginUser = asyncHandler(async (req, res) => {
    //req body-> data
    // username or email -> login
    // find user
    // password check
    // access and refresh token
    // send cookies token and send response
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "username or email is required");
    }
    
    const user = await User.findOne({
        $or: [{ email }, { username }]
    }).select(" -refreshToken");

    if (!user) {
        throw new ApiError(404, "user does not exist please register");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }
    const {refreshToken, accessToken}= await generateToken(user);
    const options={
        httpOnly: true,
        secure: true
    }
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200,
            {
                'user': user, accessToken, refreshToken,
            },
            "User logged In Successfully"
        ))
})

const logoutUser= asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true,
    }
    return res.status(200).clearCookie("accessToken", options).clearCookie("refreshToken", options).json(new ApiResponse(200, {}, "user logged out successfully"));
})

export { register, loginUser ,logoutUser};