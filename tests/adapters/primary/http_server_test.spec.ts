import request from "supertest";
import { Server } from "../../../src/adapters/primary/http/app_server";
import { InMemUserRepo } from "../../../src/adapters/secondary/user_repo/inmem";
import { RegisterUser } from "../../../src/core/usecases/registerUser";
import { AuthenticateUser } from "../../../src/core/usecases/authenticateUser";
import { ValidateToken } from "../../../src/core/usecases/validateToken";
import { LogoutUser } from "../../../src/core/usecases/logoutUser";
import { RefreshToken } from "../../../src/core/usecases/refreshToken";
import { InMemTokenRepo } from "../../../src/adapters/secondary/token_repo/inmem";
import { CreateRole } from "../../../src/core/usecases/roleUsecases/createRole";
import { GetAllRoles } from "../../../src/core/usecases/roleUsecases/getAllRoles";
import { GetRole } from "../../../src/core/usecases/roleUsecases/getRole";
import { UpdateRole } from "../../../src/core/usecases/roleUsecases/updateRole";
import { InMemRoleRepo } from "../../../src/adapters/secondary/role_repo/inmem";
import { DeleteRole } from "../../../src/core/usecases/roleUsecases/deleteRole";
import Role, { PermissionType, RoleType } from "../../../src/core/domain/role";
import { randomUUID } from "crypto";
describe("User API Routes Test Suite", () => {
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
  let createRole: CreateRole;
  let getAllRoles: GetAllRoles;
  let getRole: GetRole;
  let updateRole: UpdateRole;
  let deleteRole: DeleteRole;
  let basicUserUuid = randomUUID();

  const loginAndGetCookies = async (username: string, password: string) => {
    const loginResponse = await request(server.app)
      .post("/api/v1/users/login")
      .send({ username, password });
  
    const cookies = loginResponse.headers["set-cookie"];
    if (!Array.isArray(cookies)) {
      throw new Error("Cookies not set");
    }
  
    const refreshToken = cookies
      .find(cookie => cookie.startsWith("refreshToken="))
      .split("=")[1]
      .split(";")[0];
  
    const sessionToken = cookies
      .find(cookie => cookie.startsWith("sessionToken="))
      .split("=")[1]
      .split(";")[0];
  
    return { refreshToken, sessionToken };
  };


  beforeAll(async () => {
    inMemUserRepo = new InMemUserRepo();
    sessionTokenRepo = new InMemTokenRepo("testSecret");
    refreshTokenRepo = new InMemTokenRepo("testRefreshSecret");
    inMemRoleRepo = new InMemRoleRepo();


    inMemRoleRepo.createRole(new Role({
        name: "testBasicRole",
        isLeastPrivilege: true
    }));


    registerUser = new RegisterUser(inMemUserRepo, inMemRoleRepo);
    


    authenticateUser = new AuthenticateUser(
      inMemUserRepo,
      refreshTokenRepo,
      sessionTokenRepo
    );
    validateToken = new ValidateToken("testSecret", inMemUserRepo);
    logoutUser = new LogoutUser(
      inMemUserRepo,
      refreshTokenRepo,
      sessionTokenRepo
    );
    refreshToken = new RefreshToken(
      inMemUserRepo,
      refreshTokenRepo,
      sessionTokenRepo
    );
    createRole = new CreateRole(inMemRoleRepo);
    getAllRoles = new GetAllRoles(inMemRoleRepo);
    getRole = new GetRole(inMemRoleRepo);
    updateRole = new UpdateRole(inMemRoleRepo);
    deleteRole = new DeleteRole(inMemRoleRepo);
    server = new Server(
      registerUser,
      authenticateUser,
      validateToken,
      logoutUser,
      refreshToken,
      createRole,
      getAllRoles,
      getRole,
      updateRole,
      deleteRole
    );
  });

  afterAll(async () => {});

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
    await request(server.app).post("/api/v1/users").send({
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

    const refreshToken = loginResponse.headers["set-cookie"][0]
      .split(";")[0]
      .split("=")[1];

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
    // Create a new user
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
  
    const {refreshToken, sessionToken} = await loginAndGetCookies("newUser3", "password123");
    // Log out the user
    await request(server.app)
      .post("/api/v1/users/logout")
      .set("Cookie", [`refreshToken=${refreshToken}`, `sessionToken=${sessionToken}`])
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
  it("/api/v1/roles - should create a role successfully", async () => {

    const adminRole = await inMemRoleRepo.createRole(new Role({
      name: "testAdminRole",
      isLeastPrivilege: false,
      roleType: RoleType.ADMIN,
      permissions: [
          PermissionType.READ,
          PermissionType.WRITE,
          PermissionType.DELETE,
          PermissionType.UPDATE
      ]
    }))
    if (adminRole){
      await registerUser.run("testAdminUser", "testAdminPassword", "test@me.com", adminRole);
    }
    const {refreshToken, sessionToken} = await loginAndGetCookies("testAdminUser", "testAdminPassword");
    await request(server.app)
      .post("/api/v1/roles")
      .set("Cookie", [`refreshToken=${refreshToken}; sessionToken=${sessionToken}`])
      .send({
        id: basicUserUuid,
        name: "basicUser",
        roleType: "USER",
        permissions: ["READ", "WRITE"],
      })
      .expect(201)
      .then((response) => {
        expect(response.body.role.name).toBe("basicUser");
        expect(response.body.role.roleType).toBe("USER");
        expect(response.body.role.permissions).toEqual(["READ", "WRITE"]);
        expect(response.body.role.id).toBe(basicUserUuid);
      });
  });


  it("/api/v1/roles - should get all roles successfully", async () => {
    const {refreshToken, sessionToken} = await loginAndGetCookies("testAdminUser", "testAdminPassword");
    await request(server.app)
      .get("/api/v1/roles")
      .set("Cookie", [`refreshToken=${refreshToken}; sessionToken=${sessionToken}`])
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(response.body.length).toBe(3);
      });
  });

  it("/api/v1/roles/:id - should get a role successfully", async () => {
    const {refreshToken, sessionToken} = await loginAndGetCookies("testAdminUser", "testAdminPassword");
    await request(server.app)
      .get(`/api/v1/roles/${basicUserUuid}`)
      .set("Cookie", [`refreshToken=${refreshToken}; sessionToken=${sessionToken}`])
      .expect(200)
      .then((response) => {
        expect(response.body.role.name).toBe("basicUser");
        expect(response.body.role.roleType).toBe("USER");
        expect(response.body.role.permissions).toEqual(["READ", "WRITE"]);
        expect(response.body.role.id).toBe(basicUserUuid);
      });
  });

  it("/api/v1/roles/:id - should update a role successfully", async () => {
    const {refreshToken, sessionToken} = await loginAndGetCookies("testAdminUser", "testAdminPassword");

    await request(server.app)
      .put(`/api/v1/roles/${basicUserUuid}`)
      .set("Cookie", [`refreshToken=${refreshToken}; sessionToken=${sessionToken}`])
      .send({
        id: basicUserUuid,
        name: "basicUser",
        roleType: "USER",
        permissions: ["READ","WRITE", "UPDATE"],
      })
      .expect(200)
      .then((response) => {
        expect(response.body.role.name).toBe("basicUser");
        expect(response.body.role.roleType).toBe("USER");
        expect(response.body.role.permissions).toEqual(["READ", "WRITE", "UPDATE"]);
        expect(response.body.role.id).toBe(basicUserUuid);
      });
  });


  it("/api/v1/roles/:id - should delete a role successfully", async () => {
    const {refreshToken, sessionToken} = await loginAndGetCookies("testAdminUser", "testAdminPassword");
    await request(server.app)
      .delete(`/api/v1/roles/${basicUserUuid}`)
      .set("Cookie", [`refreshToken=${refreshToken}; sessionToken=${sessionToken}`])
      .expect(200)
      .then((response) => {
        expect(response.body.success).toBe(true);
      });
  });
});
