import {
  Intent,
  getFormProps,
  getInputProps,
  useForm,
} from "@conform-to/react";
import { conformZodMessage, parseWithZod } from "@conform-to/zod";
import { ActionFunctionArgs, json } from "@remix-run/node";
import { Form, MetaFunction, useActionData } from "@remix-run/react";
import { z } from "zod";
import {
  createUser,
  findUserByEmail,
  findUserByUsername,
} from "~/.server/models/user.model";
import { createUserSession } from "~/.server/utils/session.server";
import Button from "~/library/components/Button/Button";

import bcrypt from "bcryptjs";

export const meta: MetaFunction = () => {
  return [{ title: "Register | Bourbon Nook" }];
};

function createSchema(
  intent: Intent | null,
  options?: {
    isEmailUnique: (email: string) => Promise<boolean>;
    isUsernameUnique: (username: string) => Promise<boolean>;
  }
) {
  return z
    .object({
      email: z
        .string({ required_error: `Email is required` })
        .email()
        .min(3, `Please enter an email with at least 3 characters`)
        .pipe(
          z
            .string()
            .min(1)
            .superRefine((email, ctx) => {
              const isValidatingEmail =
                intent === null ||
                (intent.type === "validate" && intent.payload.name === "email");

              if (!isValidatingEmail) {
                ctx.addIssue({
                  code: "custom",
                  message: conformZodMessage.VALIDATION_SKIPPED,
                });
                return;
              }
              if (typeof options?.isEmailUnique !== "function") {
                ctx.addIssue({
                  code: "custom",
                  message: conformZodMessage.VALIDATION_UNDEFINED,
                  fatal: true,
                });
                return;
              }
              return options.isEmailUnique(email).then((isUnique) => {
                if (!isUnique) {
                  ctx.addIssue({
                    code: "custom",
                    message: "That email has already been registered",
                  });
                }
              });
            })
        ),
      username: z
        .string({ required_error: `Username is required` })
        .regex(
          /^[a-zA-Z0-9_-]+$/,
          `Only letters, numbers, _, and - are allowed `
        )
        .min(3, `Please enter a username with at least 3 characters`)
        .pipe(
          z
            .string()
            .min(1)
            .superRefine((username, ctx) => {
              const isValidatingUsername =
                intent === null ||
                (intent.type === "validate" &&
                  intent.payload.name === "username");

              if (!isValidatingUsername) {
                ctx.addIssue({
                  code: "custom",
                  message: conformZodMessage.VALIDATION_SKIPPED,
                });
                return;
              }
              if (typeof options?.isUsernameUnique !== "function") {
                ctx.addIssue({
                  code: "custom",
                  message: conformZodMessage.VALIDATION_UNDEFINED,
                  fatal: true,
                });
                return;
              }
              return options.isUsernameUnique(username).then((isUnique) => {
                if (!isUnique) {
                  ctx.addIssue({
                    code: "custom",
                    message: "That username has already been registered",
                  });
                }
              });
            })
        ),
      password: z
        .string({ required_error: `Password is required` })
        .min(8, `Please enter a password with at least 8 characters`),
      confirmPassword: z
        .string({ required_error: `Please confirm your password` })
        .min(8, `Please re-enter your password from above`),
      rememberMe: z.boolean().default(false),
      role: z.enum(["USER", "ADMIN"]).default("USER"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: `Passwords do not match`,
      path: ["confirmPassword"],
    });
}

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: (intent) =>
      createSchema(intent, {
        isEmailUnique: async (email) => {
          const user = await findUserByEmail(email);
          return !user;
        },
        isUsernameUnique: async (username) => {
          const user = await findUserByUsername(username);
          return !user;
        },
      }),
    async: true,
  });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const hash = await bcrypt.hash(submission.value.password, 10);

  const user = await createUser(
    {
      email: submission.value.email,
      username: submission.value.username,
      role: submission.value.role,
    },
    hash
  );

  return await createUserSession({
    request,
    userId: user.id,
    remember: submission.value.rememberMe,
    redirectTo: "/",
  });
};

export default function RegisterRoute() {
  const lastResult = useActionData<typeof action>();
  const [form, { email, username, password, confirmPassword, rememberMe }] =
    useForm({
      lastResult,
      onValidate({ formData }) {
        return parseWithZod(formData, {
          schema: (intent) => createSchema(intent),
        });
      },
      shouldValidate: "onBlur",
      shouldRevalidate: "onBlur",
    });
  return (
    <div>
      <Form
        method="post"
        className="flex flex-wrap flex-col"
        {...getFormProps(form)}
      >
        <div>
          <label htmlFor={email.id}>
            Email
            <input
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              {...getInputProps(email, { type: "email" })}
            />
          </label>
          {email.errors ? (
            <div className="text-red-500">{email.errors}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor={username.id}>
            Username
            <input
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              {...getInputProps(username, { type: "text" })}
            />
          </label>
          {username.errors ? (
            <div className="text-red-500">{username.errors}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor={password.id}>
            Password
            <input
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              {...getInputProps(password, { type: "password" })}
            />
          </label>
          {password.errors ? (
            <div className="text-red-500">{password.errors}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor={confirmPassword.id}>
            Confirm Password
            <input
              required
              className="mt-1 p-2 w-full border border-gray-300 rounded-md"
              {...getInputProps(confirmPassword, { type: "password" })}
            />
          </label>
          {confirmPassword.errors ? (
            <div className="text-red-500">{confirmPassword.errors}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor={rememberMe.id}>
            <input {...getInputProps(rememberMe, { type: "checkbox" })} />
            Remember me
          </label>
        </div>
        <div>
          <Button
            primary
            onClick={() => console.log(`Submitting the register form...`)}
            label="Register"
            type="submit"
          />
        </div>
      </Form>
    </div>
  );
}
