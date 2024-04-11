/* eslint-disable @typescript-eslint/no-explicit-any */
import { Form } from "@remix-run/react";
import Button from "../../Button/Button";
import { Checkbox } from "../../ui/checkbox";

interface BottleFormProps {
  actionUrl: string;
  formId: string;
}

export default function BottleForm({ formId, actionUrl }: BottleFormProps) {
  return (
    <Form action={actionUrl} method="POST" id={formId}>
      <div className="items-top flex space-x-2">
        <Checkbox id="imageCheck" name="imageCheck" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="imageCheck"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Add an image with this bottle
          </label>
        </div>
      </div>
      <Button
        label="Submit"
        type="submit"
        onClick={() => console.log(`Form submitted!`)}
        primary
      />
    </Form>
  );
}
