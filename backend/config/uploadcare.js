import { UploadClient } from "@uploadcare/upload-client";
import fs from "fs/promises";

const connectUploadcare = async () => {
    const client = new UploadClient({
        publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    });
    return client;
};

export const uploadToUploadcare = async (filePath) => {
    const client = await connectUploadcare();
    try {
        const fileData = await fs.readFile(filePath);
        const result = await client.uploadFile(fileData);
        return result.cdnUrl;
    } catch (error) {
        console.error("Uploadcare error: ", error);
        throw new Error("Failed to upload file to Uploadcare");
    }
};

export default connectUploadcare;