import { Outlet, useLoaderData } from "@remix-run/react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { requireUserId } from "~/.server/utils/session.server";
import { findAllBottlesByUserId } from "~/.server/models/bottle.model";
import { Icon } from "~/library/icon/icon";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const bottles = await findAllBottlesByUserId(userId);

  return json({ bottles });
};

export default function BottlesRoute() {
  const { bottles } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Your Bottles</h1>
      <Outlet />
      <ul>
        {bottles.map((bottle) => (
          <li key={bottle.id}>
            <div>{bottle.name}</div>
            <div>
              <Icon name="ExternalLink" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
