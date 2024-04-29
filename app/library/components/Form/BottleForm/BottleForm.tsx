import { Form } from "@remix-run/react";
import { TypedFetcherWithComponents } from "remix-typedjson";
import ImageForm from "../ImageForm/ImageForm";
import { ImageUploadData } from "~/routes/api.upload-image";
import { bottle } from "@prisma/client";
import { FormErrors } from "~/types/form";
import Button from "../../Button/Button";
import { SubmissionResult, getSelectProps, useForm } from "@conform-to/react";
import { bottleSchema } from "~/routes/bottles.new.info";
import { parseWithZod } from "@conform-to/zod";

export type BottleErrors = FormErrors<bottle>;

type BottleFormProps = {
  lastResult: SubmissionResult<string[]> | undefined;
  fetcher: TypedFetcherWithComponents<ImageUploadData>;
  isSubmitting: boolean;
  imageSubmitting: boolean;
  submissionSuccessful: boolean;
};

export default function BottleForm({
  lastResult,
  fetcher,
  isSubmitting,
  imageSubmitting,
  submissionSuccessful,
}: BottleFormProps) {
  const [form, fields] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bottleSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
  });

  return (
    <>
      <div className="flex w-full">
        <h2 className="text-3xl font-semibold text-white">Add a bottle</h2>
        <div
          id="form-container"
          className="flex border border-gray-200 bg-white p-4"
        >
          <ImageForm fetcher={fetcher} isSubmitting={imageSubmitting} />
          <Form
            method="POST"
            className="flex flex-col"
            action="/bottles/new/info"
            id={form.id}
          >
            <div className="-mx-3 my-3 mb-6 flex w-full flex-wrap p-2 sm:p-7">
              {submissionSuccessful ? (
                <input
                  type="hidden"
                  name="imageUrl"
                  value={fetcher.data.imgSrc}
                />
              ) : (
                <input type="hidden" name="imageUrl" value="" />
              )}
            </div>
            <div>
              <label htmlFor={fields.name.id}>
                Name
                <input
                  type="text"
                  name={fields.name.name}
                  id={fields.name.id}
                />
                {fields.name.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.name.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.type.id}>
                Spirit Type
                <input
                  type="text"
                  name={fields.type.name}
                  id={fields.type.id}
                />
                {fields.type.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.type.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.status.id}>
                Status
                <select {...getSelectProps(fields.status)}>
                  <option value="OPENED">Opened</option>
                  <option value="SEALED">Sealed</option>
                  <option value="FINISHED">Finished</option>
                </select>
                {fields.status.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.status.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.distillery.id}>
                Distillery
                <input
                  type="text"
                  name={fields.distillery.name}
                  id={fields.distillery.id}
                />
                {fields.distillery.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.distillery.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.country.id}>
                Country of Origin
                <input
                  type="text"
                  name={fields.country.name}
                  id={fields.country.id}
                />
                {fields.country.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.country.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.region.id}>
                Region
                <input
                  type="text"
                  name={fields.region.name}
                  id={fields.region.id}
                />
                {fields.region.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.region.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.price.id}>
                Price
                <input
                  type="text"
                  name={fields.price.name}
                  id={fields.price.id}
                />
                {fields.price.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.price.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.age.id}>
                Age
                <input type="text" name={fields.age.name} id={fields.age.id} />
                {fields.age.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.age.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.alcoholPercent.id}>
                ABV (ex. 58.24)
                <input
                  type="text"
                  name={fields.alcoholPercent.name}
                  id={fields.alcoholPercent.id}
                />
                {fields.alcoholPercent.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.alcoholPercent.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.year.id}>
                Year (ex. 2014)
                <input
                  type="text"
                  name={fields.year.name}
                  id={fields.year.id}
                />
                {fields.year.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.year.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.barrel.id}>
                Barrel
                <input
                  type="text"
                  name={fields.barrel.name}
                  id={fields.barrel.id}
                />
                {fields.barrel.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.barrel.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <label htmlFor={fields.finishing.id}>
                Finishing barrel(s)
                <input
                  type="text"
                  name={fields.finishing.name}
                  id={fields.finishing.id}
                />
                {fields.finishing.errors ? (
                  <div className="text-red-500 font-semibold">
                    {fields.finishing.errors}
                  </div>
                ) : null}
              </label>
            </div>
            <div>
              <Button
                type="submit"
                label={isSubmitting ? "Submitting..." : "Submit"}
                onClick={() => undefined}
                primary
              />
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}
