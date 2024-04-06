import * as cloudinary from "cloudinary";
import { writeAsyncIterableToWritable } from "@remix-run/node";

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface UploadProps {
  data: AsyncIterable<Uint8Array>;
  userId: string;
  publicId: string;
}

export async function uploadImage({ data, userId, publicId }: UploadProps) {
  // eslint-disable-next-line no-async-promise-executor
  const uploadPromise = new Promise(async (resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: `${userId}`, public_id: `${publicId}` },
      (error, result) => {
        if (error) {
          console.log(`CLOUDINARY ERROR: ${JSON.stringify(error, null, 2)}`);
          reject(error);
          return;
        }
        resolve(result);
      }
    );
    await writeAsyncIterableToWritable(data, uploadStream);
  });
  return uploadPromise;
}
