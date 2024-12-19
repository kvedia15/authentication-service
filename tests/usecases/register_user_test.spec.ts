import { RegisterUser } from "../../src/core/usecases/registerUser";
import bcrypt from "bcrypt";
import { InMemUserRepo } from "../../src/adapters/secondary/user_repo/inmem";

jest.mock("bcrypt");

describe("RegisterUser", () => {
  let userRepo: InMemUserRepo;
  let registerUser: RegisterUser;

  beforeEach(() => {
    userRepo = new InMemUserRepo();
    registerUser = new RegisterUser(userRepo);

    (bcrypt.hash as jest.Mock) = jest.fn().mockResolvedValue("hashed#password");
  });

  it("successfully registers a user with a hashed password, and then fails when same user tries to register with same username", async () => {
    const username = "testUser";
    const password = "password123";
    const email = "test@me.com";
    const user = await registerUser.run(username, password, email);

    expect(user).toBeDefined();
    expect(user.user?.Password).toBe("hashed#password");

    const sameUser = await registerUser.run(username, password, email);
    expect(sameUser.user).toBeNull();
    expect(sameUser.message).toBe("User already exists");
  });
});
