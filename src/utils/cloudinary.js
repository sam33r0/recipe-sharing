import {v2 as cloudinary} from 'cloudinary';
import fs from "fs"       
import { ApiError } from './ApiError.js';
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_API_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary= async (localFilePath)=>{
    try {
        if(!localFilePath) return null;
        const response= await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
       fs.unlinkSync(localFilePath); 
       return response;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        return null;
    }
}

const deleteFromCloudinary= async (filePath)=>{
    try {
        return await cloudinary.uploader.destroy(filePath);
    } catch (error) {
        throw new ApiError(400,"unable to delete from cloudinary");
        return null;
    } 
}

export {uploadOnCloudinary,deleteFromCloudinary}