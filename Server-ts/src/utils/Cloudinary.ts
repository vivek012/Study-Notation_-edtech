import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

interface FileWithTempPath {
  tempFilePath: string;
  mimetype?: string;
}

// ✅ Configure ONCE (not inside function)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

const uploadFilesToCloudinary = async (
  file: FileWithTempPath,
  folder: string,
  height?: number,
  quality?: number | string
): Promise<UploadApiResponse> => {

  if (!file?.tempFilePath) {
    throw new Error("File path missing");
  }

  const isVideo = file.mimetype?.startsWith("video");

  let response: UploadApiResponse;

  if (isVideo) {
    // ✅ upload (not upload_large unless file is huge)
    response = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: "video",
    });
  } else {
    response = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
      resource_type: "image",
      height,
      quality,
    });
  }

  if (!response.secure_url) {
    console.log("Cloudinary Full Response:", response);
    throw new Error("Cloudinary upload failed - secure_url missing");
  }

  return response;
};

export default uploadFilesToCloudinary;


// export const uploadFilesToCloudinary = async(file: any, folder: any, height: any, quality: any)=>{
//     const options: any = {folder};
//     if(height){
//         options.height = height;
//     }
//     if(quality){
//         options.quality = quality;
//     }
//     options.resource_type = "auto"

//     return await cloudinary.uploader.upload(file.tempFilePath, options)

// }


// const uploadFilesToCloudinary  = async (file: { tempFilePath: string; }, folder: string, height: number, quality: number) => {
//     const options: { folder: string; height?: number; quality?: number; resource_type?: "image" | "video" | "raw" | "auto" } = { folder };
//     if(height) {
//         options.height = height;
//     }
//     if(quality) {
//         options.quality = quality;
//     }
//     options.resource_type = "auto";

//     return await cloudinary.uploader.upload(file.tempFilePath, options);
// }

// export default uploadFilesToCloudinary;