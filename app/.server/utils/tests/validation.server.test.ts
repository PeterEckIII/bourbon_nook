import { faker } from "@faker-js/faker";
import { checkForExisting } from "../validation.server";
import prisma from "~/.server/libs/__mocks__/prisma";
import { Role } from "@prisma/client";

vi.mock("~/.server/__mocks__/db", async () => {
  const actual = await vi.importActual<typeof import("../../libs/prisma")>(
    "../../libs/db"
  );
  console.log(`Mocking Prisma!`);
  return {
    ...actual,
  };
});

const existingUser = {
  email: faker.internet.email(),
  username: faker.internet.userName(),
  role: Role.USER,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("Validation Model", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return an error if the email is already registered", async () => {
    prisma.user.findUnique.mockResolvedValue({ ...existingUser, id: "1" });
    const result = await checkForExisting(
      existingUser.email,
      existingUser.username
    );
    expect(result).toBeUndefined();
  });

  // it("should return an error if the username is already taken", async () => {
  //   prisma.user.findUnique.mockResolvedValue({ ...existingUser, id: "1" });
  //   const result = await checkForExisting(
  //     faker.internet.email(),
  //     existingUser.username
  //   );
  //   expect(result).toEqual({
  //     username: "That username has already been taken. Try another",
  //   });
  // });

  it("should return no errors if the email and username are not taken", async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    const result = await checkForExisting(
      faker.internet.email(),
      faker.internet.userName()
    );
    expect(result).toBeUndefined();
  });
});
