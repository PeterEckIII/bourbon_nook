import type { bottle } from "@prisma/client";
import { prisma } from "../libs/prisma";

export async function createBottle(
  payload: Omit<bottle, "id" | "createdAt" | "updatedAt">
) {
  return prisma.bottle.create({
    data: payload,
  });
}

export async function findBottleById(id: string) {
  return prisma.bottle.findUnique({
    where: {
      id,
    },
  });
}

export async function findAllBottlesByUserId(userId: string) {
  return prisma.bottle.findMany({
    where: {
      userId,
    },
  });
}
