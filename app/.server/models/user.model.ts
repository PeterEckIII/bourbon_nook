import { prisma } from "../db";
import { user } from "@prisma/client";

export const createUser = async (
  user: Omit<user, "id" | "createdAt" | "updatedAt">
) => {
  return prisma.user.create({
    data: user,
  });
};
