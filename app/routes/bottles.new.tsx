import { z } from "zod";
import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useActionData,
  useRouteError,
} from "@remix-run/react";
import { requireUserId } from "~/.server/utils/session.server";
import { parseWithZod } from "@conform-to/zod";
import { createBottle } from "~/.server/models/bottle.model";
import { useForm } from "@conform-to/react";

export const bottleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, `Please provide a meaningful name`)
    .max(
      50,
      `Name is too long to store. Please try abbreviating anything you can (e.g. "Single Barrel Barrel Proof" -->  "SiB BP")`
    ),
  type: z
    .string()
    .trim()
    .min(2, `Please provide a meaningful type to organize by`)
    .max(40, `Type is too long, please try abbreviating`),
  status: z.enum(["OPENED", "SEALED", "FINISHED"]),
  distillery: z
    .string()
    .trim()
    .min(3, `Please provide a meaningful distillery name`)
    .max(65, `Please try abbreviating a few things`),
  country: z
    .string()
    .trim()
    .min(2, `Please provide at least a 2-digit country code`)
    .max(40),
  region: z
    .string()
    .trim()
    .min(2, `Please provide at least a two character state / region code`)
    .max(50),
  price: z
    .string()
    .trim()
    // .regex(/?!(\$|£|€|¥|₽|CA|CA\$|\$CA|\$AUS|AUS|\$|\$AU|AU\$)/g)
    .min(1, `Please provide a price`)
    .max(10, `Please keep your price under 10 characters`),
  age: z
    .string()
    .trim()
    .min(
      1,
      `Please provide an age, or NAS to indicate there is no age statement`
    )
    .max(25, `Please keep this field brief (under 25 characters)`),
  alcoholPercent: z
    .string()
    .trim()
    // .regex(/?!%/g)
    .min(2, `Please provide at least a two-digit number`)
    .max(
      5,
      `Please keep your number (including decimals) to 5 characters (e.g. 49.50 / 49.5)`
    ),
  barrel: z
    .string()
    .trim()
    .min(3, `If there is no barrel information please enter "N/A"`)
    .max(35, `Please keep this field brief (under 35 characters)`),
  year: z
    .string()
    .trim()
    .min(4, `Please enter a four-digit year (2018)`)
    .max(4, `Please enter a four-digit year (2018)`),
  finishing: z
    .string()
    .trim()
    .min(3, `Please enter "N/A" if there is no finish`)
    .max(50, `Please try to abbreviate this section`),
});

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const submission = await parseWithZod(formData, { schema: bottleSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  const bottle = await createBottle({
    name: submission.value.name,
    type: submission.value.type,
    status: submission.value.status,
    distillery: submission.value.distillery,
    country: submission.value.country,
    region: submission.value.region,
    price: submission.value.price,
    age: submission.value.age,
    alcoholPercent: submission.value.alcoholPercent,
    barrel: submission.value.barrel,
    year: submission.value.year,
    finishing: submission.value.finishing,
    imageUrl: "",
    userId,
  });

  return redirect(`/bottles/${bottle.id}`);
};

export default function NewBottleRoute() {
  const lastResult = useActionData<typeof action>();
  const [form, values] = useForm({
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: bottleSchema });
    },
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  return (
    <div className="">
      <Form method="post" className="flex flex-wrap" {...form}>
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" {...values.name} name={values.name.name} />
          {values.name.errors ? (
            <div className="text-red-600">{values.name.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="type">Type</label>
          <input type="text" {...values.type} name={values.type.name} />
          {values.type.errors ? (
            <div className="text-red-600">{values.type.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <select {...values.status} name={values.status.name}>
            <option value="OPENED">Opened</option>
            <option value="SEALED">Sealed</option>
            <option value="FINISHED">Finished</option>
          </select>
          {values.status.errors ? (
            <div className="text-red-600">{values.status.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="distillery">Distillery</label>
          <input
            type="text"
            {...values.distillery}
            name={values.distillery.name}
          />
          {values.distillery.errors ? (
            <div className="text-red-600">{values.distillery.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="country">Country</label>
          <input type="text" {...values.country} name={values.country.name} />
          {values.country.errors ? (
            <div className="text-red-600">{values.country.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="region">Region</label>
          <input type="text" {...values.region} name={values.region.name} />
          {values.region.errors ? (
            <div className="text-red-600">{values.region.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input type="text" {...values.price} name={values.price.name} />
          {values.price.errors ? (
            <div className="text-red-600">{values.price.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input type="text" {...values.age} name={values.age.name} />
          {values.age.errors ? (
            <div className="text-red-600">{values.age.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="alcoholPercent">Alcohol Percent</label>
          <input
            type="text"
            {...values.alcoholPercent}
            name={values.alcoholPercent.name}
          />
          {values.alcoholPercent.errors ? (
            <div className="text-red-600">
              {values.alcoholPercent.errors[0]}
            </div>
          ) : null}
        </div>
        <div>
          <label htmlFor="barrel">Barrel</label>
          <input type="text" {...values.barrel} name={values.barrel.name} />
          {values.barrel.errors ? (
            <div className="text-red-600">{values.barrel.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="year">Year</label>
          <input type="text" {...values.year} name={values.year.name} />
          {values.year.errors ? (
            <div className="text-red-600">{values.year.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <label htmlFor="finishing">Finishing</label>
          <input
            type="text"
            {...values.finishing}
            name={values.finishing.name}
          />
          {values.finishing.errors ? (
            <div className="text-red-600">{values.finishing.errors[0]}</div>
          ) : null}
        </div>
        <div>
          <button type="submit">Create Bottle</button>
        </div>
      </Form>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>There was an error</h1>
        <pre>{error.data}</pre>
        <pre>Threw response code {error.status}</pre>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div>
        <h1>There was an error</h1>
        <pre>{error.message}</pre>
        <pre>Stacktrace {error.stack?.toString()} </pre>
      </div>
    );
  } else {
    return (
      <div>
        <h1>
          Unknown error! You shouldn&apos;t we here. Press back on your browser
          or load the homepage in your browser
        </h1>
        <pre>ERROR: {JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }
}
