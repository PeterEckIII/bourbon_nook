import { prisma } from "../libs/prisma";
import { Prisma } from "@prisma/client";

export const createUser = async (
  user: Prisma.userCreateInput,
  hash: string
) => {
  return await prisma.user.create({
    data: {
      email: user.email,
      username: user.username,
      role: user.role,
      password: {
        create: {
          hash,
        },
      },
    },
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { id },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { email },
  });
};

export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUniqueOrThrow({
    where: { username },
  });
};

export const updateUser = async (id: string, data: Prisma.userUpdateInput) => {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  return user;
};
