import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { type ActionFunctionArgs, json, MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";
import { createUserSession } from "~/.server/utils/session.server";
import { Button } from "~/library/components/ui/button";
import { Checkbox } from "~/library/components/ui/checkbox";
import { Input } from "~/library/components/ui/input";

export const meta: MetaFunction = () => {
  return [{ title: "Login | Bourbon Nook" }];
};

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
        <div className="items-top space-x-2 my-4 w-full">
          <label
            htmlFor={email.id}
            className="font-semibold text-lg text-gray-600 block mb-2 ml-2 dark:text-gray-100"
          >
            Email
          </label>
          <Input
            id={email.id}
            name={email.name}
            type="email"
            required
            className="w-full"
          />
        </div>
        <div className="items-top space-x-2 my-4 w-full">
          <label
            htmlFor={password.id}
            className="font-semibold text-lg text-gray-600 block mb-2 ml-2 dark:text-gray-100"
          >
            Password
          </label>
          <Input
            id={password.id}
            name={password.name}
            type="password"
            required
            className="w-full"
          />
        </div>
        <div className="flex justify-between w-full">
          <div className="w-1/3">
            <div className="items-top flex space-x-2 my-4">
              <Checkbox id={rememberMe.id} name={rememberMe.name} />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={rememberMe.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember me
                </label>
              </div>
            </div>
          </div>
          <div className="w-2/3">
            <Button type="submit" variant="default">
              Login
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}

{
  /* <div className="w-full">
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
        </div> */
}
{
  /* <div className="w-full">
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
        </div> */
}
