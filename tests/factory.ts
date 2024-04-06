import { createUser as createDbUser } from "~/.server/models/user.model";
import { faker } from "@faker-js/faker";
import { user } from "@prisma/client";

const createUser = (role: user["role"]) => () =>
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
