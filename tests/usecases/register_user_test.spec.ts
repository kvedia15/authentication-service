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

  it("successfully registers a user with a hashed password", async () => {
    const username = "testUser";
    const password = "password123";
    const email = "test@me.com";
    const user = await registerUser.run(username, password, email);

    expect(user).toBeDefined();
    expect(user?.Password).toBe("hashed#password");
  });
});
