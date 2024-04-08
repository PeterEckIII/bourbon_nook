/* eslint-disable @typescript-eslint/no-explicit-any */
import { InputHTMLAttributes } from "react";
import ValidationMessage from "../../ValidationMessage/ValidationMessage";
import { FieldMetadata } from "@conform-to/react";
import { bottleSchema } from "~/routes/bottles.new";

interface TextboxProps extends InputHTMLAttributes<HTMLInputElement> {
  field: FieldMetadata<typeof bottleSchema, Record<string, any>, string[]>;
  label: string;
  type: "text" | "password" | "email";
  placeholder: string;
  navigationState: "idle" | "submitting" | "loading";
}

export default function Textbox({
  field,
  label,
  type,
  placeholder,
  navigationState,
  ...rest
}: TextboxProps) {
  return (
    <div className="mt-5 w-full lg:w-1/2 xl:w-1/3 flex flex-col">
      <label
        className="font-semibold text-lg text-gray-600 block mb-2"
        htmlFor={`${field.id}-field`}
      >
        {label}
      </label>
      <input
        type={type}
        aria-invalid={field.errors !== undefined}
        id={`${field.id}-field`}
        name={field.name}
        placeholder={placeholder}
        className={
          "outline-none text-base font-normal w-96 text-[rgb(52,64,84)] bg-white border border-gray-400 shadow-inputShadow rounded-lg py-3 px-4 placeholder:text-base placeholder:text-gray-500"
        }
        {...rest}
      />
      {field.errors ? (
        <div className="block">
          <ValidationMessage
            isSubmitting={navigationState === "submitting"}
            error={field.errors ? field.errors : ""}
          />
        </div>
      ) : null}
    </div>
  );
}
