import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { type ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { createUserSession } from "~/.server/utils/session.server";

export const schema = z.object({
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(3, `Emails/Usernames must be at least 3 characters`),
  password: z.string().min(8, `The password must be at least 8 characters`),
  rememberMe: z.boolean().default(false),
});

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = parseWithZod(formData, {
    schema,
  });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  return createUserSession({
    request,
    userId: "1",
    remember: true,
    redirectTo: "/bottles",
  });
};

export default function LoginRoute() {
  const lastSubmission = useActionData<typeof action>();
  const [form, { email, password, rememberMe }] = useForm({
    lastResult: lastSubmission,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onBlur",
  });
  return (
    <div className="flex">
      <Form method="post" className="flex flex-wrap" id={form.id}>
        <div className="w-full">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email or Username
          </label>
          <input
            type="email"
            name={email.name}
            id={email.id}
            autoComplete="email"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
          {email.errors ? (
            <p className="text-red-500 text-xs italic">{email.errors}</p>
          ) : null}
        </div>
        <div className="w-full">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name={password.name}
            id={password.id}
            autoComplete="current-password"
            required
            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
          />
          {password.errors ? (
            <p className="text-red-500 text-xs italic">{password.errors}</p>
          ) : null}
        </div>
        <div>
          <label htmlFor={rememberMe.id} className="flex items-center">
            <input
              type="checkbox"
              name={rememberMe.name}
              id={rememberMe.id}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Remember me</span>
          </label>
        </div>
        <div className="w-full">
          <button
            type="submit"
            className="mt-4 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign in
          </button>
        </div>
      </Form>
    </div>
  );
}
