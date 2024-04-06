import { prisma } from "../db";
import { user } from "@prisma/client";

export const createUser = async (
  user: Omit<user, "id" | "createdAt" | "updatedAt">,
  password: string
) => {
  return prisma.user.create({
    data: {
      ...user,
      password: {
        create: {
          hash: password,
        },
      },
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByUsername = async (username: string) => {
  return prisma.user.findUnique({
    where: { username },
  });
};
