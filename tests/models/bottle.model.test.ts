import { user } from "@prisma/client";
import {
  findAllBottlesByUserId,
  findBottleById,
} from "../../app/.server/models/bottle.model";
import {
  createUser,
  findUserByEmail,
} from "../../app/.server/models/user.model";
import { prisma } from "~/.server/libs/prisma";

beforeAll(async () => {
  await createUser(
    {
      email: "test@test.com",
      username: "testuser",
      role: "USER",
    },
    "testpassword12343!"
  );
});

beforeEach(async () => {
  const user = (await findUserByEmail("test@test.com")) as user;
  const bottles = await findAllBottlesByUserId(user.id);
  for (const bottle of bottles) {
    console.log(`Deleting bottle with id: ${bottle.id}`);
    await prisma.bottle.deleteMany({ where: { userId: user.id } });
  }
});

describe("Bottle model", () => {
  it("CREATE -- creates a bottle", async ({ integration }) => {
    const user = (await findUserByEmail("test@test.com")) as user;
    const bottle = await integration.createSealedBottle(user.id);
    expect(bottle).toBeDefined();
    expect(bottle.userId).toBe(user.id);
  });

  it("READ -- finds a bottle by id", async ({ integration }) => {
    const user = (await findUserByEmail("test@test.com")) as user;
    const bottle = await integration.createSealedBottle(user.id);
    const foundBottle = await findBottleById(bottle.id);
    expect(foundBottle).toBeDefined();
    expect(foundBottle?.id).toBe(bottle.id);
  });

  it("READ -- finds all bottles by user id", async ({ integration }) => {
    const user = (await findUserByEmail("test@test.com")) as user;
    await integration.createSealedBottle(user.id);
    await integration.createSealedBottle(user.id);
    const bottles = await findAllBottlesByUserId(user.id);
    expect(bottles).toBeDefined();
    expect(bottles).toHaveLength(2);
  });
});

afterAll(async () => {
  const user = (await findUserByEmail("test@test.com")) as user;
  const bottles = await findAllBottlesByUserId(user.id);
  for (const bottle of bottles) {
    await prisma.bottle.delete({ where: { id: bottle.id } });
  }
  await prisma.user.delete({ where: { id: user.id } });
});
