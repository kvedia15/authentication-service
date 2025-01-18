import Role, { RoleType } from "../../../core/domain/role";
import { PrimaryAdapter } from "../../../core/ports/primary";
import { ICreateRole, IRegisterUser } from "../../../core/ports/usecases";
import monitor from "../../../monitor";
import { OwnerUserConfig } from "../../../settings";

export class StartupAdapter implements PrimaryAdapter {
  private registerUserUsecase: IRegisterUser;
  private createRoleUsecase: ICreateRole;
  private ownerUserConfig: OwnerUserConfig;
  constructor(
    registerUserUsecase: IRegisterUser,
    createRoleUsecase: ICreateRole,
    ownerUserConfig: OwnerUserConfig
  ) {
    this.registerUserUsecase = registerUserUsecase;
    this.createRoleUsecase = createRoleUsecase;
    this.ownerUserConfig = ownerUserConfig;
  }

  async run(): Promise<void> {
    monitor.info("Running startup process");

    //TODO use Get all roles , and check that at least one owner, admin and user exists
    let ownerRole = await this.createRoleUsecase.run(
      new Role({
        name: "Owner",
        isLeastPrivilege: false,
        roleType: RoleType.OWNER,
      })
    );
    if (!ownerRole) {
      monitor.error("Error creating Owner role");
      throw new Error("Start up failed, cancelling process");
    }
    monitor.info("Owner role created");

    let role = await this.createRoleUsecase.run(
      new Role({
        name: "User",
        isLeastPrivilege: true,
        roleType: RoleType.USER,
      })
    );
    if (!role) {
      monitor.error("Error creating User role");
    }
    monitor.info("User role created");

    role = await this.createRoleUsecase.run(
      new Role({
        name: "Admin",
        isLeastPrivilege: false,
        roleType: RoleType.ADMIN,
      })
    );
    if (!role) {
      monitor.error("Error creating Admin role");
    }
    monitor.info("Admin role created");

    //TODO add a get user usecase, to check first if an owner exists, if not create
    let user = await this.registerUserUsecase.run(
      this.ownerUserConfig.username,
      this.ownerUserConfig.password,
      this.ownerUserConfig.email,
      ownerRole
    );
    if (!user) {
      monitor.error("Error registering Owner user");
    }
    monitor.info("Owner user registered");
  }

  stop(): void {}
}
