import userLogin from "../Models/userModel.js";
import AWS from 'aws-sdk';
import {Readable} from 'stream';
import { v4 as uuidv4 } from 'uuid';

AWS.config.update({accessKeyId: 'AKIA3QFUUJY4JCXNC4GN',secretAccessKey:'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'})
const s3 = new AWS.S3();

export const signup = async (req, res) => {
  try {
    // Create a new user instance using the request body
    const user = new userLogin({...req.body});

    // Save the user to the database
    await user.save();

    // Send a success response
    res.status(200).json("User has been created");
  } catch (error) {
    // Handle errors
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const uploadVideoS3 = async (req,res)=>{
  try{
    const videoFile = req.file;
     const bucketName = 'ss-ats-assets';
     const userAuthId = uuidv4();
     const key = `interview-Zipvideos/${userAuthId}`; // Adjust the key as needed
 
     // Upload the video Blob to S3
     const uploadParams = {
       Bucket: bucketName,
       Key: key,
       Body: videoFile.buffer,
       ContentType: 'application/zip', // Set the content type based on your video type
     };
 
     const uploadResult = await s3.upload(uploadParams).promise();
     console.log('Video uploaded to S3:', uploadResult.Location);
 
     res.status(200).json({ success: true, message: 'Video uploaded successfully' });
  }catch(err){
    console.log("error :",err)
  }
}
