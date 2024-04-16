import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { findBottleById } from "~/.server/models/bottle.model";
import { requireUserId } from "~/.server/utils/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUserId(request);

  const bottleId = params.bottleId;

  invariant(bottleId, "No bottle ID provided");
  const bottle = await findBottleById(bottleId);
  if (!bottle) {
    throw new Response("Bottle not found", { status: 404 });
  }

  invariant(bottle, `Bottle with ID ${bottleId} cannot found`);

  return json({ bottle });
};

export default function BottleIdRoute() {
  const { bottle } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1>{bottle.name}</h1>
      <p>{bottle.type}</p>
      <p>{bottle.distillery}</p>
      <p>{bottle.country}</p>
      <p>{bottle.region}</p>
      <p>{bottle.price}</p>
      <p>{bottle.age}</p>
      <p>{bottle.alcoholPercent}</p>
    </div>
  );
}
