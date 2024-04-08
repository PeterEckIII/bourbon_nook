import { createUser, findUserByEmail } from "~/.server/models/user.model";

describe("User Model", () => {
  it("CREATE - creates a user", async ({ integration }) => {
    const user = await integration.createNormalUser("123");

    expect(user).toBeDefined();
    expect(user.email).toMatch(/@/);
    const foundUser = await findUserByEmail(user.email);
    expect(foundUser).toBeDefined();
  });

  it("CREATE - should throw an error if the email is already taken", async ({
    integration,
  }) => {
    const user = await integration.createNormalUser("123");
    expect(() =>
      createUser({ ...user, username: "something_unique" })
    ).rejects.toThrowError();
  });

  it("FIND -- finds a user by email", async ({ integration }) => {
    const user = await integration.createNormalUser("123");
    const foundUser = await findUserByEmail(user.email);

    expect(foundUser).toBeDefined();
  });
});
