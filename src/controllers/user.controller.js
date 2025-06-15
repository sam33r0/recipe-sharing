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

    // const avatarLocalPath = req.file?.path;
    const { username, email, fullName, dob, password, avatar } = req.body;
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

    // if (!avatarLocalPath)
    //     throw new ApiError(409, "no dp to upload");

    //const avatar = await uploadOnCloudinary(avatarLocalPath);
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
        "-password "
    )

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }

    return res.status(201).json(
        new ApiResponse(201, createdUser, "User registered Successfully")
    )

})

const generateToken = async (user) => {
    try {
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
    const { refreshToken, accessToken } = await generateToken(user);
    const options = {
        httpOnly: true,
        secure: true
    }
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
        new ApiResponse(200,
            {
                'user': user, accessToken, refreshToken,
            },
            "User logged In Successfully"
        ))
})

const logoutUser = asyncHandler(async (req, res) => {
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

const refreshAccessToken = asyncHandler(async (req, res) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request")
        }
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await User.findById(decodedToken?._id);
        if (!user || incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Invalid refresh token");
        }
        const { accessToken, refreshToken } = await generateToken(user);
        const options = {
            httpOnly: true,
            secure: true
        }
        return res.status(200)
            .cookie("accessToken", accessToken, options).
            cookie("refreshToken", refreshToken, options).
            json(new ApiResponse(200, { accessToken, refreshToken }, "refreshed access token successfully"));
    } catch (error) {
        throw new ApiError(500, error?.message || "internal server error");
    }

})

const changeCurrentPassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user?._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json(new ApiResponse(200, {}, "password change successfully"));
})

const getCurrentUser = asyncHandler(async (req, res) => {
    if (req?.user)
        return res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
    return res.status(404).json(new ApiResponse(404, {}, "No user found"));
})

const updateAccountDetails = asyncHandler(async (req, res) => {
    const { fullName, email } = req.body;
    if (!fullName && !email) {
        throw new ApiError(400, " All fields are required");
    }
    const existedUser = await User.findOne({
        $or: [{ email }]
    })
    if (existedUser) {
        throw new ApiError(400, "email already exists");
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set: {
            fullName, email
        }
    }, { new: true }).select("-password ");
    res.status(200).json(new ApiResponse(200, user, "Account details uploaded successfully"));

})

const updateUserAvatar = asyncHandler(async (req, res) => {
    // const avatarLocalPath = req.file?.path
    // if (!avatarLocalPath) {
    //     throw new ApiError(400, "Avatar file is missing");
    // }
    const { avatar } = req.body;
    if (!avatar.url) {
        throw new ApiError(400, "Cloudinary upload error");
    }
    const oldAvatar = req.user?.avatar;
    const user = await User.findByIdAndUpdate(
        req.user?._id, {
        $set: {
            avatar: avatar.url
        }
    }, { new: true }
    ).select("-password ");
    await deleteFromCloudinary(oldAvatar);
    return res.status(200).json(new ApiResponse(200, user, "avatar updated successfull"));
})

export {
    register,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar
};