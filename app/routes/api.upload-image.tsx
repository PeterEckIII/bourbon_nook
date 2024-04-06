import {
  type ActionFunctionArgs,
  json,
  unstable_parseMultipartFormData as parseMultiPartFormData,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_composeUploadHandlers as composeUploadHandlers,
  UploadHandler,
} from "@remix-run/node";
import { uploadImage } from "~/.server/utils/cloudinary.server";
import { CloudinaryUploadResponse } from "~/types/cloudinary";

export const action = async ({ request }: ActionFunctionArgs) => {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }
      const uploadedImage = (await uploadImage({
        data,
        userId: "user-id",
        publicId: "public-id",
      })) as CloudinaryUploadResponse;
      return uploadedImage.secure_url;
    },
    createMemoryUploadHandler()
  );

  const formData = await parseMultiPartFormData(request, uploadHandler);
  const imgSrc = formData.get("img");
  if (!imgSrc) {
    return json({
      error: `There was no image submitted with the form`,
    });
  }
  return json({ imgSrc });
};
