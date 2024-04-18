import type { bottle, Prisma } from "@prisma/client";
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

export async function updateBottle(
  bottleId: string,
  payload: Prisma.bottleUpdateInput
) {
  return prisma.bottle.update({
    where: {
      id: bottleId,
    },
    data: payload,
  });
}
