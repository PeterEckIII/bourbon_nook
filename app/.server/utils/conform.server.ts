import { z, ZodError } from "zod";

export interface ErrorObject {
  [name: string]: string;
}

export interface Payload {
  [name: string]: string | number;
}

export async function handleFormData(request: Request, zodSchema: z.Schema) {
  const formData = await request.formData();
  const formPayload = Object.fromEntries(formData);
  let result;
  const errors: ErrorObject = {};

  try {
    const validatedPayload = zodSchema.parse(formPayload);
    result = validatedPayload;
  } catch (error) {
    if (error instanceof ZodError) {
      for (const err of error.issues) {
        errors[err.path[0]] = err.message;
      }
    }
  }
  return { result, errors, formData };
}
