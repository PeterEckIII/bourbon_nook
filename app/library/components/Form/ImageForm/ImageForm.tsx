import { ChangeEvent, useState } from "react";
import { TypedFetcherWithComponents } from "remix-typedjson";
import { ImageUploadData } from "~/routes/api.upload-image";
import Button from "../../Button/Button";
import ImageUploader from "./ImageUploader";

interface ImageFormProps {
  fetcher: TypedFetcherWithComponents<ImageUploadData>;
  isSubmitting: boolean;
}

export default function ImageForm({ fetcher, isSubmitting }: ImageFormProps) {
  const [previewUrl, setPreviewUrl] = useState<string>("");

  function handlePreviewChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.currentTarget.files) {
      throw new Error(`Error reading files from import`);
    }
    if (e.currentTarget.files && e.currentTarget.files[0] !== undefined) {
      console.log(`Handling preview image`);
      const newUrl = URL.createObjectURL(e.currentTarget.files[0]);
      setPreviewUrl(newUrl);
    } else {
      console.log(`Cannot handle preview image`);
      setPreviewUrl("");
    }
  }

  const clearPreviewUrl = () => {
    setPreviewUrl("");
  };

  return (
    <div id="image-container" className="w-full lg:block lg:h-full">
      <fetcher.Form
        encType="multipart/form-data"
        method="POST"
        className="h-full"
        action="/api/upload-image"
      >
        <ImageUploader
          fetcher={fetcher}
          previewUrl={previewUrl}
          onPreviewChange={handlePreviewChange}
        />
        <div className="flex w-full justify-end">
          <div className="my-2 text-right">
            <Button
              onClick={() => clearPreviewUrl()}
              type="button"
              label="Clear image"
              primary={false}
            />
          </div>
          <Button
            primary
            onClick={() => undefined}
            label={isSubmitting ? "Uploading..." : "Upload"}
            type="submit"
          />
        </div>
      </fetcher.Form>
    </div>
  );
}
