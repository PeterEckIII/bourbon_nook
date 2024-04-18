import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  UploadHandler,
  json,
  redirect,
  unstable_composeUploadHandlers,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { requireUserId } from "~/.server/utils/session.server";
import { uploadImage } from "~/.server/utils/cloudinary.server";
import { randomUUID } from "crypto";
import { CloudinaryUploadResponse } from "~/types/cloudinary";
import { findBottleById, updateBottle } from "~/.server/models/bottle.model";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const bottleId = params.bid;

  return json({ bottleId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const publicId = randomUUID();
  const uploadHandler: UploadHandler = unstable_composeUploadHandlers(
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
    unstable_createMemoryUploadHandler()
  );

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );
  const imgSrc = formData.get("img")?.toString();
  const bottleId = formData.get("bottleId")?.toString();

  if (!imgSrc || !bottleId) {
    return json({
      error: `There was no image submitted with the form, or you came from a weird route`,
    });
  }

  const bottle = await findBottleById(bottleId);

  if (!bottle) {
    return json({
      error: `No bottle found with id ${bottleId}`,
    });
  }

  const newPayload = {
    ...bottle,
    imageUrl: imgSrc,
  };

  await updateBottle(bottleId, newPayload);
  return redirect(`/bottles/${bottleId}`);
};

export default function NewBottleImageRoute() {
  const { bottleId } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>Upload an image for your bottle</h1>
      <form
        action="/bottles/new/image"
        method="post"
        encType="multipart/form-data"
      >
        <input type="file" name="img" />
        <input type="hidden" name="bottleId" value={bottleId} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
