import { prisma } from "../libs/prisma";
import { Prisma } from "@prisma/client";

export const createUser = async (user: Prisma.userCreateInput) => {
  return await prisma.user.create({
    data: user,
  });
};

export const findUserById = async (id: string) => {
  try {
    return await prisma.user.findUniqueOrThrow({
      where: { id },
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error.message;
    }
  }
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserByUsername = async (username: string) => {
  return await prisma.user.findUnique({
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
