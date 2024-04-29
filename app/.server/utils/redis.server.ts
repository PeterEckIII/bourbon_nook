import { bottle } from "@prisma/client";
import * as redis from "redis";

export type RedisFormData = Partial<bottle> & {
  formId: string;
};

const client = redis.createClient({
  url: process.env.REDIS_URL,
});

client.on("error", (err) => {
  console.error(`Redis client error ${err}`);
});

const KEY_VERSION = "1";

export function generateFormId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export async function saveToRedis(data: RedisFormData) {
  await client.connect();
  await client.set(`f-${KEY_VERSION}-${data.formId}`, JSON.stringify(data));
  await client.quit();
}

export async function getDataFromRedis(
  formId: string
): Promise<RedisFormData | null> {
  await client.connect();
  const data = await client.get(`f-${KEY_VERSION}-${formId}`);
  await client.quit();
  return data ? (JSON.parse(data) as RedisFormData) : null;
}

export async function requireFormData(
  request: Request
): Promise<RedisFormData> {
  const url = new URL(request.url);
  const formId = url.searchParams.get("id");

  if (typeof formId !== "string" || !formId) {
    throw new Error(`No form ID!`);
  }

  const formData = await getDataFromRedis(formId);
  if (!formData) {
    throw new Error(`Form data not found for id ${formId}`);
  }

  return formData;
}

export async function deleteFormData(formId: string) {
  await client.connect();
  await client.del(`f-${KEY_VERSION}-${formId}`);
  await client.quit();
}
