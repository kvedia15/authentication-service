import request from "supertest";
import { Server } from "../../../src/adapters/primary/http/app_server"; // Adjust the path as necessary
import { InMemUserRepo } from "../../../src/adapters/secondary/user_repo/inmem";
import { InMemTableRepo } from "../../../src/adapters/secondary/table_repo/inmem";
import { RegisterUser } from "../../../src/core/usecases/registerUser";
import { AuthenticateUser } from "../../../src/core/usecases/authenticateUser"; // Adjust the path as necessary
import { ValidateToken } from "../../../src/core/usecases/validateToken";
import { CreateTable } from "../../../src/core/usecases/createTable";
import { GetTable } from "../../../src/core/usecases/getTable";

describe("Server - Integration Test with InMemUserRepo", () => {
  let server: Server;
  let inMemUserRepo: InMemUserRepo;
  let inMemTableRepo: InMemTableRepo;
  let registerUser: RegisterUser;
  let authenticateUser: AuthenticateUser;
  let validateToken: ValidateToken;
  let createTable: CreateTable;
  let getTable: GetTable;

  beforeAll(() => {
    inMemUserRepo = new InMemUserRepo();
    inMemTableRepo = new InMemTableRepo();
    registerUser = new RegisterUser(inMemUserRepo);
    authenticateUser = new AuthenticateUser(inMemUserRepo, "testToken");
    validateToken = new ValidateToken("testToken");
    createTable = new CreateTable(inMemTableRepo);
    getTable = new GetTable(inMemTableRepo);
    server = new Server(
      registerUser,
      authenticateUser,
      validateToken,
      createTable,
      getTable,
    );
  });

  it("/users - should register a user successfully", async () => {
    await request(server.app)
      .post("/api/v1/users")
      .send({
        username: "testUser",
        password: "password123",
        email: "test@me.com",
      })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.user.username).toBe("testUser");
      });
  });

  it("/users/authenticate - should authenticate the user successfully", async () => {
    await request(server.app).post("/api/v1/users").send({
      username: "testUser2",
      password: "password123",
      email: "test@me.com",
    });

    await request(server.app)
      .post("/api/v1/users/authenticate")
      .send({ username: "testUser2", password: "password123" })
      .expect(200);
  });

  it("/users/authenticate - should fail authentication with wrong password", async () => {
    await request(server.app)
      .post("/api/v1/users/authenticate")
      .send({ username: "testUser2", password: "wrongPassword" })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(false);
      });
  });
});
