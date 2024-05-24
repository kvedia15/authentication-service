import { AuthenticateUser } from "../../src/core/usecases/authenticateUser";
import bcrypt from "bcrypt";
import { InMemUserRepo } from "../../src/adapters/secondary/user_repo/inmem";

jest.mock("bcrypt");

describe("AuthenticateUser", () => {
  let userRepo: InMemUserRepo;
  let authenticateUser: AuthenticateUser;

  beforeEach(async () => {
    userRepo = new InMemUserRepo();
    authenticateUser = new AuthenticateUser(userRepo, "jwtToken");

    (bcrypt.compare as jest.Mock).mockImplementation(
      async (password: string, hash: string) =>
        password === "password123" && hash === "hashed#password",
    );

    await userRepo.createUser("existingUser", "hashed#password", "test@me.com");
  });

  it("authenticates a user successfully with correct credentials", async () => {
    const user = await authenticateUser.run("existingUser", "password123");

    expect(user).toBeDefined();
    expect(user?.Username).toBe("existingUser");
  });

  it("fails to authenticate a user with a non-existent username", async () => {
    const user = await authenticateUser.run("nonExistentUser", "password123");

    expect(user).toBe(null);
  });

  it("fails to authenticate a user with incorrect password", async () => {
    const user = await authenticateUser.run("existingUser", "wrongPassword");

    expect(user).toBe(null);
  });

  it("fails to authenticate a user with incorrect jwt", async () => {
    authenticateUser = new AuthenticateUser(userRepo, "undefined");
    const user = await authenticateUser.run("existingUser", "password123");
    expect(user).toBe(null);
  });
});
