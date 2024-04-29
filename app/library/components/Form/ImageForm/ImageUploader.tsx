import type { ChangeEvent } from "react";
import { Icon } from "~/library/icon/icon";
import type { TypedFetcherWithComponents } from "remix-typedjson";
import { ImageUploadData } from "~/routes/api.upload-image";
import Spinner from "../../Spinner/Spinner";

type ImageUploaderProps = {
  fetcher: TypedFetcherWithComponents<ImageUploadData>;
  previewUrl: string;
  onPreviewChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export default function ImageUploader({
  fetcher,
  previewUrl,
  onPreviewChange,
}: ImageUploaderProps) {
  return (
    <div className="mb-2 ml-0 mr-0 mt-0 rounded-lg bg-white p-2">
      <span className="text-lg">Image of bottle</span>
      <div className="clear-both mx-auto my-0 block w-full">
        <div className="w-full items-center justify-center">
          <label
            htmlFor="img"
            className="float-left clear-both mx-2 my-4 w-full cursor-pointer select-none rounded-lg border-[3px] border-gray-300 bg-white px-6 py-8 text-center transition-all duration-200 ease-linear hover:border-blue-500"
          >
            <input
              type="file"
              name="img"
              id="img"
              accept="image/*"
              className="sr-only"
              onChange={(e) => onPreviewChange(e)}
            />
            <div>
              {previewUrl !== "" &&
              fetcher.state === "idle" &&
              typeof fetcher.data !== "undefined" ? (
                <div>
                  <img
                    src={previewUrl}
                    alt="Your current upload"
                    className="mx-auto my-0 h-64 w-64 object-cover lg:h-96 lg:w-64"
                  />
                </div>
              ) : fetcher.state === "submitting" ||
                fetcher.state === "loading" ? (
                <Spinner loading={true} />
              ) : fetcher.state === "idle" &&
                typeof fetcher.data !== "undefined" ? (
                <div
                  id="upload-confirmation"
                  className="border-black-100 m-4 flex items-center justify-center rounded-md p-4 text-green-700"
                >
                  <Icon name="CheckCircle" />
                  <span>&nbsp;</span>Successfully uploaded!
                </div>
              ) : (
                <div className="clear-both mb-2 ml-0 mr-0 mt-0 w-full">
                  <Icon name="Download" className="h-10 w-10 my-4 mx-auto" />
                  <div className="float-left clear-both block w-full">
                    Select an image from your device
                  </div>
                </div>
              )}
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}
