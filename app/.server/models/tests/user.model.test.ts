import { faker } from "@faker-js/faker";
import { Role } from "@prisma/client";
import { createUser, findUserById, updateUser } from "../user.model";
import prisma from "~/.server/libs/__mocks__/prisma";

vi.mock("~/.server/__mocks__/db", async () => {
  const actual = await vi.importActual<typeof import("../../libs/prisma")>(
    "../../libs/db"
  );
  console.log(`Mocking Prisma!`);
  return {
    ...actual,
  };
});

const testUser = {
  id: "1",
  email: faker.internet.email(),
  username: faker.internet.userName(),
  role: Role.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("User Model", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  it("CREATE -- should create a user", async () => {
    const today = new Date();
    const newUser = {
      id: "1",
      email: faker.internet.email(),
      username: faker.internet.userName(),
      role: Role.USER,
      createdAt: today,
      updatedAt: today,
    };
    prisma.user.create.mockResolvedValue(newUser);
    const user = await createUser(newUser, "testpassword12343!");
    expect(user).toStrictEqual(newUser);
    expect(newUser.email).toBe(user.email);
  });
  it("FIND -- should find a user by id", async () => {
    prisma.user.findUniqueOrThrow.mockResolvedValue(testUser);
    expect(await findUserById("1")).toBeTruthy();
  });
  it("FIND -- should throw an error if the user does not exist", async () => {
    prisma.user.findUniqueOrThrow.mockImplementation(() => {
      throw new Error("No user found");
    });

    const response = await findUserById("abcdefg");
    expect(response).toBe("No user found");
  });
  it("FIND -- should find a user by email", async () => {
    prisma.user.findUnique.mockResolvedValue(testUser);
    expect(await findUserById("1")).toBeTruthy();
  });
  it("FIND -- should find a user by username", async () => {
    prisma.user.findUnique.mockResolvedValue(testUser);
    expect(await findUserById("1")).toBeTruthy();
  });
  it("UPDATE -- should update a user", async () => {
    prisma.user.update.mockResolvedValue(testUser);
    await updateUser("1", {});
  });
});
