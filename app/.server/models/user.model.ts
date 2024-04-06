import { prisma } from "../db";
import { user } from "@prisma/client";
import bcrypt from "bcryptjs";

export const createUser = async (
  user: Omit<user, "id" | "createdAt" | "updatedAt">,
  password: string
) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({
    data: {
      ...user,
      password: {
        create: {
          hash: hashedPassword,
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
