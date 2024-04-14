import exp from "constants";
import { InMemUserRepo } from "../../../src/adapters/secondary/user_repo/inmem";
import User from "../../../src/core/domain/user";

describe("InMemUserRepo", () => {
  let repo: InMemUserRepo;

  beforeEach(() => {
    repo = new InMemUserRepo();
  });

  describe("createUser", () => {
    it("successfully adds a user", async () => {
      const username = "testUser";
      const password = "password123";
      const email = "test@me.com";
      const user = await repo.createUser(username, password, email);

      expect(user).not.toBeNull();
      expect(user).toBeInstanceOf(User);
      if (user != null) {
        expect(user.Username).toBe(username);
        expect(user.Password).toBe(password);
      }
    });
  });

  describe("getUser", () => {
    it("successfully retrieves an existing user by username", async () => {
      const username = "existingUser";
      const password = "password123";
      const email = "test@me.com";
      await repo.createUser(username, password, email);

      const retrievedUser = await repo.getUser(username);
      expect(retrievedUser).not.toBeUndefined();
      expect(retrievedUser?.Username).toBe(username);
    });

    it("returns undefined when a user does not exist", async () => {
      const nonExistentUser = await repo.getUser("nonExistentUser");
      expect(nonExistentUser).toBeUndefined();
    });
  });
});
