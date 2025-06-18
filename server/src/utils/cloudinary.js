import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  // api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret: process.env.CLOUDINARY_API_SECRET
  cloud_name: 'dzd7eycft', 
  api_key: '591532553549646', 
  api_secret: 'eq-jp8-N95SVaUY_X67vsy3v7pU'
});

const uploadOnCloudinary = async (localfilePath) => {
try {

if(!localfilePath){
    throw new Error("No file path provided");
}
//console.log("localfilePath", localfilePath);


// Upload the file to Cloudinary
const response = await cloudinary.uploader.upload(localfilePath, {
    resource_type: "auto",
})


//file uploaded successfully
//console.log("File uploaded successfully to Cloudinary", response);
return response;


} catch (error) {
fs.unlinkSync(localfilePath); // Delete the file from local storage if operation fails
console.log("Error uploading file to Cloudinary", error.message);
return null;
}
}

export default uploadOnCloudinary;