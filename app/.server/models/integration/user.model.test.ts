import { createUser, findUserByEmail } from "../user.model";

describe("User Model", () => {
  it("CREATE - creates a user", async () => {
    const user = await createUser(
      {
        email: "test@test.com",
        username: "test",
        role: "USER",
      },
      "testpassword123!"
    );

    expect(user).toBeDefined();
  });

  it("CREATE - should throw an error if the email is already taken", async ({
    integration,
  }) => {
    const user = await integration.createNormalUser();
    expect(() =>
      createUser({ ...user, username: "something_unique" }, "testpassword123!")
    ).rejects.toThrowError();
  });

  it("FIND -- finds a user by email", async ({ integration }) => {
    const user = await integration.createNormalUser();
    const foundUser = await findUserByEmail(user.email);

    expect(foundUser).toBeDefined();
  });
});
