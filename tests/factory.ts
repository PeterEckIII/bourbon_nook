import { createUser as createDbUser } from "~/.server/models/user.model";
import { createBottle as createDbBottle } from "~/.server/models/bottle.model";
import { faker } from "@faker-js/faker";
import { BottleStatus, type user } from "@prisma/client";

// ============================== USERS ==============================
const createUser = (role: user["role"]) =>
  createDbUser(
    {
      email: faker.internet.email(),
      username: faker.internet.userName(),
      role,
    },
    faker.internet.password()
  );

export const createNormalUser = createUser("USER");

export const createAdminUser = createUser("ADMIN");

// ============================== BOTTLES ==============================
const createBottle = (status: BottleStatus) => (userId: user["id"]) =>
  createDbBottle({
    userId,
    name: faker.commerce.productName(),
    type: faker.commerce.productAdjective(),
    status,
    distillery: faker.company.name(),
    age: faker.word.noun(),
    alcoholPercent: faker.finance.amount(),
    price: faker.commerce.price(),
    country: faker.location.country(),
    region: faker.location.state(),
    year: faker.date.past().getFullYear().toString(),
    barrel: faker.commerce.productAdjective(),
    finishing: faker.commerce.productAdjective(),
    imageUrl: faker.image.url(),
  });

export const createSealedBottle = createBottle("SEALED");
export const createOpenedBottle = createBottle("OPENED");
export const createFinishedBottle = createBottle("FINISHED");

// ============================== REVIEWS ==============================
