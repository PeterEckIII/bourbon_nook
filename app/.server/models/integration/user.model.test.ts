import { createUser } from "../user.model";

describe("User Model", () => {
  it("creates a user", async () => {
    const user = await createUser({
      email: "test@test.com",
      username: "test",
      role: "USER",
    });

    expect(user).toBeDefined();
  });

  it("should throw an error if the email is already taken", async ({
    integration,
  }) => {
    const user = await integration.createNormalUser();
    expect(() =>
      createUser({ ...user, username: "something_unique" })
    ).rejects.toThrowError();
  });
});
