import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";

const register= asyncHandler((req,res)=>{
// get user details from frontend,
    // validation- notE
    // check if already exist
    // check compulsory
    // upload to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response 
    // check for user creation
    // return res

    const {name, username, email, dob}= req.body;
    
})


export {register};