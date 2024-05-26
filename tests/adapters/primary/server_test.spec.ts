import request from "supertest";
import { Server } from "../../../src/adapters/primary/http/app_server"; // Adjust the path as necessary
import { InMemUserRepo } from "../../../src/adapters/secondary/user_repo/inmem";
import { InMemTableRepo } from "../../../src/adapters/secondary/table_repo/inmem";
import { InMemPlayerRepo } from "../../../src/adapters/secondary/player_repo/inmem";
import { RegisterUser } from "../../../src/core/usecases/registerUser";
import { AuthenticateUser } from "../../../src/core/usecases/authenticateUser";
import { ValidateToken } from "../../../src/core/usecases/validateToken";
import { CreateTable } from "../../../src/core/usecases/createTable";
import { GetTable } from "../../../src/core/usecases/getTable";
import { JoinTable } from "../../../src/core/usecases/joinTable";
import { UUID } from "crypto";

describe("Server - Integration Test with InMemUserRepo", () => {
  let server: Server;
  let inMemUserRepo: InMemUserRepo;
  let inMemTableRepo: InMemTableRepo;
  let inMemPlayerRepo: InMemPlayerRepo;
  let registerUser: RegisterUser;
  let authenticateUser: AuthenticateUser;
  let validateToken: ValidateToken;
  let createTable: CreateTable;
  let getTable: GetTable;
  let joinTable: JoinTable;
  let sessionToken: string;
  let tableId: UUID;

  beforeAll(async () => {
    inMemUserRepo = new InMemUserRepo();
    inMemTableRepo = new InMemTableRepo();
    inMemPlayerRepo = new InMemPlayerRepo();
    registerUser = new RegisterUser(inMemUserRepo);
    authenticateUser = new AuthenticateUser(inMemUserRepo, "testToken");
    validateToken = new ValidateToken("testToken");
    createTable = new CreateTable(inMemTableRepo);
    getTable = new GetTable(inMemTableRepo);
    joinTable = new JoinTable(inMemTableRepo, inMemPlayerRepo);
    server = new Server(
      registerUser,
      authenticateUser,
      validateToken,
      createTable,
      getTable,
      joinTable
    );

    await request(server.app).post("/api/v1/users").send({
      username: "testUser",
      password: "password123",
      email: "test@me.com",
    });

    const authResponse = await request(server.app)
      .post("/api/v1/users/authenticate")
      .send({ username: "testUser", password: "password123" });

    sessionToken = authResponse.body.user.sessionToken;
  });

  it("/users - should register a user successfully", async () => {
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

  it("/users - should not register a user", async () => {
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

  it("/users/authenticate - should authenticate the user successfully", async () => {
    await request(server.app).post("/api/v1/users").send({
      username: "testUser2",
      password: "password123",
      email: "test2@me.com",
    });

    await request(server.app)
      .post("/api/v1/users/authenticate")
      .send({ username: "testUser2", password: "password123" })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
      });
  });

  it("/users/authenticate - should fail authentication with wrong password", async () => {
    await request(server.app)
      .post("/api/v1/users/authenticate")
      .send({ username: "testUser2", password: "wrongPassword" })
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
      });
  });

  it("/tables - should not create a table successfully when no user", async () => {
    await request(server.app)
      .post("/api/v1/tables")
      .send({ buyIn: 1000 })
      .expect(401) 
      .then((response) => {
        expect(response.body.success).toBe(false);
      });
  });

  it("/tables - should not create a table successfully when no buyIn", async () => {
    await request(server.app)
      .post("/api/v1/tables")
      .set("sessiontoken", sessionToken)
      .send({ buyIn: null })
      .expect(400) 
      .then((response) => {
        expect(response.body.success).toBe(false);
      });
  });



  it("/tables - should create a table successfully", async () => {
    await request(server.app)
      .post("/api/v1/tables")
      .set("sessiontoken", sessionToken)
      .send({ buyIn: 1000 })
      .expect(201)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.table).toBeDefined();
        tableId = response.body.table.tableId;
      });
  });



  it("/tables/:tableId - should retrieve a table successfully", async () => {
    await request(server.app)
      .get(`/api/v1/tables/${tableId}`)
      .set("sessiontoken", sessionToken)
      .expect(200) 
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.table).toBeDefined();
        expect(response.body.table.tableId).toBe(tableId);
      });
  });

  it("/tables/:tableId - not found table", async () => {
    await request(server.app)
      .get("/api/v1/tables/9cff2bcd-a559-41d0-8543-100bb18cd190")
      .set("sessiontoken", sessionToken)
      .expect(404) 
      .then((response) => {
        expect(response.body.success).toBe(false);
      });
  });

  it("/tables/:tableId - should return error for invalid table ID", async () => {
    await request(server.app)
      .get(`/api/v1/tables/invalid-table-id`)
      .set("sessiontoken", sessionToken)
      .expect(400) 
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error_message).toBe("Invalid table ID");
      });
  });

  it("/tables - should return error when user is not authenticated", async () => {
    await request(server.app)
      .post("/api/v1/tables")
      .send({ buyIn: 1000 }) 
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error_message).toBe("User not authenticated");
      });
  });

  it("/tables - should return error when session token is invalid", async () => {
    await request(server.app)
      .post("/api/v1/tables")
      .set("sessiontoken", "invalidToken")
      .send({ buyIn: 1000 }) 
      .expect(401)
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error_message).toBe("User not authenticated");
      });
  });

  it("/tables/join/:tableId - should join a table successfully", async () => {
    await request(server.app)
      .post(`/api/v1/tables/join/${tableId}`)
      .set("sessiontoken", sessionToken)
      .send({ buyIn: 1000 })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.table).toBeDefined();
        expect(response.body.table.players.length).toBe(2);
        expect(response.body.table.players[1].chipCount).toBe(1000);
        expect(response.body.table.players[1].name).toBe("testUser");
      });
  });

  it("/tables/join/:tableId - should return error for invalid table ID", async () => {
    await request(server.app)
      .post(`/api/v1/tables/join/invalid-table-id`)
      .set("sessiontoken", sessionToken)
      .send({ buyIn: 1000 })
      .expect(400) 
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error_message).toBe("Invalid table ID");
      });
  });

  it("/tables/join/:tableId - should return error when buy in not provided", async () => {
    await request(server.app)
      .post(`/api/v1/tables/join/${tableId}`)
      .send({ buyIn: null })
      .expect(400) 
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error_message).toBe("Buy-in amount is required");
      });
  });
  it("/tables/join/:tableId - should return error when table does not exist", async () => {
    await request(server.app)
      .post(`/api/v1/tables/join/9cff2bcd-a559-41d0-8543-100bb18cd190`)
      .send({ buyIn: 1000 })
      .expect(404) 
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error_message).toBe("Table not found or error joining table");
      });
  });

  it("toTableResponse - should return error message when table is null", async () => {
    const response = server["toTableResponse"](null, "Error creating table");
    expect(response).toEqual({
      success: false,
      error_message: "Error creating table",
      table: {},
    });
  });

  it("toTableResponse - should return table data when table is defined", async () => {
    let user = await inMemUserRepo.getUser("testUser")!;
    if (user) {
      const table = await createTable.run(user, 0);
      const response = server["toTableResponse"](table, "Error creating table");
      expect(response).toEqual({
        success: true,
        error_message: "",
        table: table?.toJSON(),
      });
    }
  });


});