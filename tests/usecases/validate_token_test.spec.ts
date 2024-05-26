import jwt from "jsonwebtoken";
import { ValidateToken } from "../../src/core/usecases/validateToken";

jest.mock("jsonwebtoken");

describe("ValidateToken", () => {
  let validateToken: ValidateToken;
  const mockJwtToken = "mockJwtSecret";

  beforeEach(() => {
    validateToken = new ValidateToken(mockJwtToken);
  });

  it("validates a token successfully and returns a User object", async () => {
    const token = "validToken";
    const decodedPayload = { userId: 1, username: "testUser" };

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, decodedPayload);
    });

    const user = await validateToken.run(token);

    expect(user).toBeDefined();
    expect(user?.Id).toBe(1);
    expect(user?.Username).toBe("testUser");
  });

  it("returns null for an invalid token", async () => {
    const token = "invalidToken";

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid token"), null);
    });

    const user = await validateToken.run(token);

    expect(user).toBeNull();
  });

  it("returns null for a token with invalid payload type (string)", async () => {
    const token = "validTokenWithStringPayload";

    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, "invalidPayload");
    });

    const user = await validateToken.run(token);
    expect(user).toBeNull();
  });

  it("catches an error thrown during token verification", async () => {
    const token = "tokenThatCausesError";

    jest.spyOn(validateToken as any, 'verifyToken').mockImplementation(() => {
      throw new Error("Test error");
    });

    const user = await validateToken.run(token);

    expect(user).toBeNull();
  });
  
});