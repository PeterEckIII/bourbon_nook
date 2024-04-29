import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import {
  ActionFunctionArgs,
  json,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { requireUserId } from "~/.server/utils/session.server";
import {
  deleteBottle,
  findAllBottlesByUserId,
} from "~/.server/models/bottle.model";
import { Icon } from "~/library/icon/icon";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const bottles = await findAllBottlesByUserId(userId);

  return json({ bottles });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);

  const formData = await request.formData();
  const bottleId = formData.get("bottleId")?.toString();

  if (bottleId) {
    await deleteBottle(bottleId, userId);
  }

  return null;
};

export default function BottlesIndexRoute() {
  const { bottles } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <div>
      <h1>Your Bottles</h1>
      <ul>
        {bottles.map((bottle) => (
          <li
            key={bottle.id}
            className="flex"
            style={{
              opacity: navigation.formData?.get("id") === bottle.id ? 0.25 : 1,
            }}
          >
            <div>{bottle.name}</div>
            <Icon name="ExternalLink" />
            <Form method="POST" style={{ display: "inline" }}>
              <input type="hidden" name="bottleId" value={bottle.id} />
              <button type="submit" aria-label="delete">
                <Icon name="TrashCan" />
              </button>
            </Form>
          </li>
        ))}
      </ul>
    </div>
  );
}
