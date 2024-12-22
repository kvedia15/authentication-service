import request from "supertest";
import { Server } from "../../../src/adapters/primary/http/app_server";
import { InMemUserRepo } from "../../../src/adapters/secondary/user_repo/inmem";
import { RegisterUser } from "../../../src/core/usecases/registerUser";
import { AuthenticateUser } from "../../../src/core/usecases/authenticateUser";
import { ValidateToken } from "../../../src/core/usecases/validateToken";
import { LogoutUser } from "../../../src/core/usecases/logoutUser";
import { RefreshToken } from "../../../src/core/usecases/refreshToken";
import { InMemTokenRepo } from "../../../src/adapters/secondary/psql/token_repo/inmem";
import { assert } from "console";
import { InMemRoleRepo } from "../../../src/adapters/secondary/role_repo/inmem";
describe("User Routes Test Suite", () => {
  let server: Server;
  let inMemUserRepo: InMemUserRepo;
  let inMemRoleRepo: InMemRoleRepo;
  let sessionTokenRepo: InMemTokenRepo;
  let refreshTokenRepo: InMemTokenRepo;
  let registerUser: RegisterUser;
  let authenticateUser: AuthenticateUser;
  let validateToken: ValidateToken;
  let logoutUser: LogoutUser;
  let refreshToken: RefreshToken;

  beforeAll(async () => {
    inMemUserRepo = new InMemUserRepo();
    sessionTokenRepo = new InMemTokenRepo("testSecret");
    refreshTokenRepo = new InMemTokenRepo("testRefreshSecret");
    inMemRoleRepo = new InMemRoleRepo();
    registerUser = new RegisterUser(inMemUserRepo, inMemRoleRepo);
    authenticateUser = new AuthenticateUser(inMemUserRepo,refreshTokenRepo, sessionTokenRepo);
    validateToken = new ValidateToken("testToken");
    logoutUser = new LogoutUser(inMemUserRepo, refreshTokenRepo, sessionTokenRepo);
    refreshToken = new RefreshToken(inMemUserRepo, refreshTokenRepo, sessionTokenRepo);

    server = new Server(registerUser, authenticateUser, validateToken, logoutUser, refreshToken);
  });

  afterAll(async () => {
  });

  it("/api/v1/users - should register a user successfully", async () => {
    await request(server.app)
      .post("/api/v1/users")
      .send({
        username: "newUser",
        password: "password123",
        email: "new@me.com",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.user.username).toBe("newUser");
      });
  });

  it("/api/v1/users - should not register a user with missing fields", async () => {
    await request(server.app)
      .post("/api/v1/users")
      .send({
        username: "newUser",
        password: "",
        email: "new@me.com",
      })
      .expect(400)
      .then((response) => {
        expect(response.body.success).toBe(false);
      });
  });

  it("/api/v1/users/login - should authenticate a user successfully", async () => {
    await request(server.app)
      .post("/api/v1/users")
      .send({
        username: "newUser",
        password: "password123",
        email: "test@me.com",
      }); 

    let resp = await request(server.app)
      .post("/api/v1/users/login")
      .send({ username: "newUser", password: "password123" })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.user.username).toBe("newUser");
      });

    
  });

  it("/api/v1/users/login - should fail authentication with incorrect credentials", async () => {
    await request(server.app)
      .post("/api/v1/users/login")
      .send({ username: "newUser", password: "wrongPassword" })
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
      });
  });

  it("/api/v1/users/refresh-token - should refresh session successfully", async () => {

    await request(server.app)
    .post("/api/v1/users")
    .send({
      username: "newUser2",
      password: "password123",
      email: "new@me.com",
    })
    .expect(201)
    .then((response) => {
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe("newUser2");
    });

    const loginResponse = await request(server.app)
      .post("/api/v1/users/login")
      .send({ username: "newUser2", password: "password123" });

    const refreshToken = loginResponse.headers["set-cookie"][0].split(";")[0].split("=")[1];
    
    await request(server.app)
      .post("/api/v1/users/refresh-token")
      .set("Cookie", `refreshToken=${refreshToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.user.username).toBe("newUser2");
      });
  });

  it("/api/v1/users/refresh-token - should fail with invalid refresh token", async () => {
    await request(server.app)
      .post("/api/v1/users/refresh-token")
      .set("Cookie", "refreshToken=invalidToken")
      .expect(401)
      .then((response) => {
        expect(response.body.message).toBe("Invalid or expired refresh token");
      });
  });

  it("/api/v1/users/logout - should log out a user successfully", async () => {
    await request(server.app)
    .post("/api/v1/users")
    .send({
      username: "newUser3",
      password: "password123",
      email: "new@me.com",
    })
    .expect(201)
    .then((response) => {
      expect(response.body.success).toBe(true);
      expect(response.body.user.username).toBe("newUser3");
    });

    const loginResponse = await request(server.app)
      .post("/api/v1/users/login")
      .send({ username: "newUser3", password: "password123" });

    const refreshToken = loginResponse.headers["set-cookie"][0].split(";")[0].split("=")[1];

    await request(server.app)
      .post("/api/v1/users/logout")
      .set("Authorization", `Bearer ${loginResponse.body.user.sessionToken}`)
      .set("Cookie", `refreshToken=${refreshToken}`)
    .expect(200)  
      .then((response) => {
        expect(response.body.success).toBe(true);
      });
  });

  it("/api/v1/users/logout - should fail logout with missing tokens", async () => {
    await request(server.app)
      .post("/api/v1/users/logout")
      .expect(400)
      .then((response) => {
        expect(response.body.message).toBe("Refresh token missing");
      });
  });


});
