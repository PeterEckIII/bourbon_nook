import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  json,
  redirect,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createBottle } from "~/.server/models/bottle.model";
import { ErrorObject, handleFormData } from "~/.server/utils/conform.server";
import { bottleSchema } from "~/.server/utils/schemas";
import { requireUserId } from "~/.server/utils/session.server";
import Button from "~/library/components/Button/Button";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return null;
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const { result, errors } = await handleFormData(request, bottleSchema);

  try {
    await createBottle({
      ...result,
      userId,
    });
    return redirect(`/bottles`);
  } catch (error) {
    return json<typeof errors>(errors);
  }
};

export default function NewBottleInfoRoute() {
  const errors = useActionData<ErrorObject>();
  return (
    <div>
      <h1 className="text-4xl text-red-600 m-4">Hello world!</h1>
      <Form method="POST">
        <div>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
          {errors?.name ? <p>{errors.name}</p> : null}
        </div>
        <div>
          <label htmlFor="type">Spirit Type</label>
          <input type="text" name="type" id="type" />
          {errors?.name ? <p>{errors.type}</p> : null}
        </div>
        <div>
          <label htmlFor="status">Status</label>
          <input type="text" name="status" id="status" />
          {errors?.name ? <p>{errors.status}</p> : null}
        </div>
        <div>
          <label htmlFor="distillery">Distillery</label>
          <input type="text" name="distillery" id="distillery" />
          {errors?.name ? <p>{errors.distillery}</p> : null}
        </div>
        <div>
          <label htmlFor="country">Country of Origin</label>
          <input type="text" name="country" id="country" />
          {errors?.name ? <p>{errors.country}</p> : null}
        </div>
        <div>
          <label htmlFor="region">Region</label>
          <input type="text" name="region" id="region" />
          {errors?.name ? <p>{errors.region}</p> : null}
        </div>
        <div>
          <label htmlFor="price">Price</label>
          <input type="text" name="price" id="price" />
          {errors?.name ? <p>{errors.price}</p> : null}
        </div>
        <div>
          <label htmlFor="age">Age</label>
          <input type="text" name="age" id="age" />
          {errors?.name ? <p>{errors.age}</p> : null}
        </div>
        <div>
          <label htmlFor="alcoholPercent">ABV</label>
          <input type="text" name="alcoholPercent" id="alcoholPercent" />
          {errors?.name ? <p>{errors.alcoholPercent}</p> : null}
          {/* ADD PROOF CALCULATOR OR MAKE THIS INPUT SWITCHABLE WITH A DROPDOWN */}
        </div>
        <div>
          <label htmlFor="barrel">Batch / Barrel Information</label>
          <input type="text" name="barrel" id="barrel" />
          {errors?.name ? <p>{errors.barrel}</p> : null}
        </div>
        <div>
          <label htmlFor="year">Release Year</label>
          <input type="text" name="year" id="year" />
          {errors?.name ? <p>{errors.year}</p> : null}
        </div>
        <div>
          <label htmlFor="finishing">Finishing Barrels</label>
          <input type="text" name="finishing" id="finishing" />
          {errors?.name ? <p>{errors.finishing}</p> : null}
        </div>
        <div>
          <Button
            primary
            type="submit"
            label="Next"
            onClick={() => console.log(`Form submitted!`)}
          />
        </div>
      </Form>
    </div>
  );
}
