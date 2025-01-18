import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

export const client = new S3Client({
    region: "default", // Specify your S3 region
    endpoint: process.env.LIARA_ENDPOINT, // S3-compatible storage endpoint
    credentials: {
        accessKeyId: process.env.LIARA_ACCESS_KEY, // Your access key
        secretAccessKey: process.env.LIARA_SECRET_KEY // Your secret key
    },
});

//const filePath = "./upload-img.jpg"; // Path to your local file
const bucketName = process.env.LIARA_BUCKET_NAME; // Your bucket name
//const objectKey = "images/upload-image.jpg"; // Destination key in the bucket

export const uploadImage = async (filePath,objectKey) => {
    try {
        const fileContent = fs.readFileSync(filePath); // Read file from the local directory
        const params = {
            Body: fileContent, // Pass file content as the body
            Bucket: bucketName, // Bucket name
            Key: objectKey, // Key (file name/path in the bucket)
            //ContentType: "image/jpeg", // Set the appropriate content type
        };

        const data = await client.send(new PutObjectCommand(params)); // Upload the file
        console.log("Upload successful:", data);
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};

