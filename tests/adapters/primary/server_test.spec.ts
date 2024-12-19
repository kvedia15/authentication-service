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
import { LeaveTable } from '../../../src/core/usecases/leaveTable';
import { AddTransaction } from "../../../src/core/usecases/addTransaction";
import Table from "../../../src/core/domain/table";
import Player from "../../../src/core/domain/player";

describe("Server Test with InMemUserRepo", () => {
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
  let leaveTable: LeaveTable;
  let addTransaction: AddTransaction;
  let sessionToken: string;
  let tableId: UUID;

  beforeAll(async () => {
    inMemUserRepo = new InMemUserRepo();
    inMemTableRepo = new InMemTableRepo();
    inMemPlayerRepo = new InMemPlayerRepo();

    registerUser = new RegisterUser(inMemUserRepo);
    authenticateUser = new AuthenticateUser(inMemUserRepo, "testToken");
    validateToken = new ValidateToken("testToken");
    createTable = new CreateTable(inMemTableRepo, inMemPlayerRepo);
    getTable = new GetTable(inMemTableRepo, inMemPlayerRepo);
    joinTable = new JoinTable(inMemTableRepo, inMemPlayerRepo);
    leaveTable = new LeaveTable(inMemTableRepo, inMemPlayerRepo);
    addTransaction  = new AddTransaction(inMemTableRepo, inMemPlayerRepo);
    server = new Server(
      registerUser,
      authenticateUser,
      validateToken,
      createTable,
      getTable,
      joinTable,
      leaveTable,
      addTransaction
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
        let table = response.body.table;
        let players = table.players;
        expect(players[0].chipCount).toBe(1000);
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
      .post(`/api/v1/tables/${tableId}/join`)
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
      .post(`/api/v1/tables/invalid-table-id/join`)
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
      .post(`/api/v1/tables/${tableId}/join`)
      .send({ buyIn: null })
      .expect(400) 
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error_message).toBe("Buy-in amount is required");
      });
  });
  it("/tables/join/:tableId - should return error when table does not exist", async () => {
    await request(server.app)
      .post(`/api/v1/tables/9cff2bcd-a559-41d0-8543-100bb18cd190/join`)
      .send({ buyIn: 1000 })
      .expect(404) 
      .then((response) => {
        expect(response.body.success).toBe(false);
        expect(response.body.error_message).toBe("Table not found or error joining table");
      });
  });

  it("/tables/leave/:tableId - should leave a table successfully", async () => {
    const joinTableResponse = await request(server.app)
    .post(`/api/v1/tables/${tableId}/join`)
    .set("sessiontoken", sessionToken)
    .send({ buyIn: 1000 })
    .expect(200);
    let playerId = joinTableResponse.body.table.players[1].playerId;
    await request(server.app)
      .post(`/api/v1/tables/${tableId}/leave`)
      .send({ playerId: playerId })
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
        expect(response.body.table).toBeDefined();
        for (let i = 0; i < response.body.table.players.length; i++) {
          if (response.body.table.players[i].playerId === playerId) {
            expect(response.body.table.players[i].playerId).toBe(playerId);
          }
        }
      });
  });

});