import { LoaderFunctionArgs, ActionFunctionArgs } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { json } from "react-router";
import { requireUserId } from "~/.server/utils/session.server";
import ErrorBoundaryComponent from "~/library/components/ErrorBoundary/ErrorBoundaryComponent";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  return json({ userId });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const type = formData.get("type")?.toString();
  const userId = formData.get("userId")?.toString();

  console.log(`NAME: ${name}\nTYPE: ${type}\n`);
  return json({ name, type, userId });
};

export default function NewReviewInfoRoute() {
  const { userId } = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();
  return (
    <main>
      <h1>New Review Info</h1>
      <Form method="POST" action="/reviews/new/info">
        <div>
          <label htmlFor="name">
            Name
            <input type="text" name="name" id="name" />
          </label>
        </div>
        <div>
          <label htmlFor="type">
            Type
            <input type="text" name="type" id="type" />
          </label>
        </div>
        <input type="hidden" name="userId" value={userId} />
        <div>
          <button type="submit">Submit</button>
        </div>
      </Form>
      {data?.name && <pre>{JSON.stringify(data.name)}</pre>}
      {data?.type && <pre>{JSON.stringify(data.type)}</pre>}
      {data?.userId && <pre>{JSON.stringify(data.userId)}</pre>}
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  return <ErrorBoundaryComponent error={error} />;
}
