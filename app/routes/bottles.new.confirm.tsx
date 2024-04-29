import { BottleStatus } from "@prisma/client";
import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  json,
} from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { createBottle } from "~/.server/models/bottle.model";
import { getDataFromRedis } from "~/.server/utils/redis.server";
import { requireUserId } from "~/.server/utils/session.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await requireUserId(request);
  const formId = params.fid;

  if (!formId) {
    return redirect("/bottles/new/info");
  }

  const redisData = await getDataFromRedis(formId);

  return json({ redisData });
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const formId = formData.get("formId")?.toString();
  if (!formId) {
    return redirect("/bottles/new/info");
  }

  const redisData = await getDataFromRedis(formId);
  if (!redisData || redisData === null) {
    const name = formData.get("name")?.toString();
    const type = formData.get("type")?.toString();
    const status = formData.get("status")?.toString();
    const distillery = formData.get("distillery")?.toString();
    const country = formData.get("country")?.toString();
    const region = formData.get("region")?.toString();
    const price = formData.get("price")?.toString();
    const age = formData.get("age")?.toString();
    const alcoholPercent = formData.get("alcoholPercent")?.toString();
    const barrel = formData.get("barrel")?.toString();
    const year = formData.get("year")?.toString();
    const finishing = formData.get("finishing")?.toString();
    const imageUrl = formData.get("imageUrl")?.toString();

    const newBottle = await createBottle({
      name: name ?? "",
      type: type ?? "",
      status: status as BottleStatus,
      distillery: distillery ?? "",
      country: country ?? "",
      region: region ?? "",
      price: price ?? "",
      age: age ?? "",
      alcoholPercent: alcoholPercent ?? "",
      barrel: barrel ?? "",
      year: year ?? "",
      finishing: finishing ?? "",
      imageUrl: imageUrl ?? "",
      userId,
    });
    return redirect(`/bottles/${newBottle.id}`);
  }

  const bottle = await createBottle({
    name: redisData?.name ?? "",
    type: redisData?.type ?? "",
    status: redisData?.status as BottleStatus,
    distillery: redisData?.distillery ?? "",
    country: redisData?.country ?? "",
    region: redisData?.region ?? "",
    price: redisData?.price ?? "",
    age: redisData?.age ?? "",
    alcoholPercent: redisData?.alcoholPercent ?? "",
    barrel: redisData?.barrel ?? "",
    year: redisData?.year ?? "",
    finishing: redisData?.finishing ?? "",
    imageUrl: redisData?.imageUrl ?? "",
    userId,
  });

  return redirect(`/bottles/${bottle.id}`);
};

export default function NewBottleConfirmRoute() {
  const { redisData } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Confirm</h1>
      <Form method="POST">
        <input
          type="hidden"
          name="formId"
          id="formId"
          value={redisData?.formId ?? ""}
        />
        <input
          type="text"
          name="name"
          id="name"
          value={redisData?.name ?? ""}
        />
        <input
          type="text"
          name="type"
          id="type"
          value={redisData?.type ?? ""}
        />
        <input
          type="text"
          name="status"
          id="status"
          value={redisData?.status ?? ""}
        />
        <input
          type="text"
          name="distillery"
          id="distillery"
          value={redisData?.distillery ?? ""}
        />
        <input
          type="text"
          name="country"
          id="country"
          value={redisData?.country ?? ""}
        />
        <input
          type="text"
          name="region"
          id="region"
          value={redisData?.region ?? ""}
        />
        <input
          type="text"
          name="price"
          id="price"
          value={redisData?.price ?? ""}
        />
        <input type="text" name="age" id="age" value={redisData?.age ?? ""} />
        <input
          type="text"
          name="alcoholPercent"
          id="alcoholPercent"
          value={redisData?.alcoholPercent ?? ""}
        />
        <input
          type="text"
          name="barrel"
          id="barrel"
          value={redisData?.barrel ?? ""}
        />
        <input
          type="text"
          name="year"
          id="year"
          value={redisData?.year ?? ""}
        />
        <input
          type="text"
          name="finishing"
          id="finishing"
          value={redisData?.finishing ?? ""}
        />
      </Form>
    </div>
  );
}
