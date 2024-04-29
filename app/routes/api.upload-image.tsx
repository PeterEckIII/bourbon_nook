import {
  type ActionFunctionArgs,
  json,
  unstable_parseMultipartFormData as parseMultiPartFormData,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_composeUploadHandlers as composeUploadHandlers,
  UploadHandler,
} from "@remix-run/node";
import { randomUUID } from "crypto";
import { uploadImage } from "~/.server/utils/cloudinary.server";
import { requireUserId } from "~/.server/utils/session.server";
import { CloudinaryUploadResponse } from "~/types/cloudinary";

export type ImageUploadData = {
  error?: string;
  imgSrc?: string;
  publicId?: string;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const publicId = randomUUID();

  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "img") {
        return undefined;
      }
      const uploadedImage = (await uploadImage({
        data,
        userId,
        publicId,
      })) as CloudinaryUploadResponse;
      return uploadedImage.secure_url;
    },
    createMemoryUploadHandler()
  );

  const formData = await parseMultiPartFormData(request, uploadHandler);
  const imgSrc = formData.get("img")?.toString();

  if (!imgSrc) {
    return json<ImageUploadData>({
      error: `There was no image submitted with the form`,
    });
  }
  return json<ImageUploadData>({ imgSrc, publicId });
};
