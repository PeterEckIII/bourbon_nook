/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldMetadata, getInputProps } from "@conform-to/react";
import { Input } from "../../ui/input";

interface TextProps {
  name: FieldMetadata<unknown, any, any>;
  label: string;
  id: string;
  type: "text" | "password" | "email";
}

export default function Text({ name, label, id, type }: TextProps) {
  return (
    <div className="mt-5 w-full lg:w-1/2 xl:w-1/3 flex flex-col">
      <label htmlFor={id} className="my-4 ml-2">
        {label}
      </label>
      <Input {...getInputProps(name, { type })} id={id} className="w-full" />
    </div>
  );
}
