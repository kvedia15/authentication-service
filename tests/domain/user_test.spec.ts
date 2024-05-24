import User from "../../src/core/domain/user"; // Adjust the path as necessary

describe("User", () => {
  const userId = 1;
  const username = "testUser";
  const password = "password123";
  const email = "test@me.com";
  let user: User;

  beforeEach(() => {
    user = new User(userId, username, password, email);
  });

  describe("constructor", () => {
    it("creates a User with the correct properties", () => {
      expect(user.Id).toBe(userId);
      expect(user.Username).toBe(username);
      expect(user.Password).toBe(password);
    });
  });

  describe("toJSON", () => {
    it("returns an object with the correct id and username", () => {
      const jsonRepresentation = user.toJSON();
      expect(jsonRepresentation).toEqual({
        id: userId,
        username: username,
        email: email,
        sessionToken: null,
      });
    });
  });

  describe("SessionToken", () => {
    it("sets the session token correctly", () => {
      const sessionToken = "testToken";
      user.SessionToken = sessionToken;
      expect(user.SessionToken).toBe(sessionToken);
    });
  });
});
