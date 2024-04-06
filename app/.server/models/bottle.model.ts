import type { bottle } from "@prisma/client";
import { prisma } from "../db";

export async function createBottle(
  payload: Omit<bottle, "id" | "createdAt" | "updatedAt">
) {
  return await prisma.bottle.create({
    data: payload,
  });
}
