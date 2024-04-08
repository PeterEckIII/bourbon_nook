/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldMetadata, FormMetadata } from "@conform-to/react";
import { Form } from "@remix-run/react";
import Button from "../../Button/Button";
import Textbox from "../../Inputs/TextBox/Textbox";
import { bottleSchema } from "~/routes/bottles.new";

interface BottleFormProps {
  actionUrl: string;
  inputs: Required<{
    [x: string]: FieldMetadata<
      typeof bottleSchema,
      Record<string, any>,
      string[]
    >;
  }>;
  formId: string;
}

export default function BottleForm({
  inputs,
  formId,
  actionUrl,
}: BottleFormProps) {
  return (
    <Form action={actionUrl} method="POST" id={formId}>
      <Textbox
        label="Bottle Name"
        type="text"
        name="name"
        placeholder="Buffalo Trace"
        error=""
        navigationState="idle"
        value=""
      />
      <Textbox
        label="Bottle Type"
        type="text"
        name="type"
        placeholder="Bourbon"
        error=""
        navigationState="idle"
        value=""
      />
      <Textbox
        label="Status"
        type="text"
        name="status"
        placeholder="Sealed"
        error=""
        navigationState="idle"
        value=""
      />
      <Button
        label="Submit"
        type="submit"
        onClick={() => console.log(`Form submitted!`)}
        primary
      />
    </Form>
  );
}
