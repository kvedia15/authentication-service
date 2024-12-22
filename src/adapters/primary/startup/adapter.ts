import Role, { RoleType } from "../../../core/domain/role";
import { PrimaryAdapter } from "../../../core/ports/primary";
import { ICreateRole, IRegisterUser } from "../../../core/ports/usecases";
import monitor from "../../../monitor";

export class StartupAdapter implements PrimaryAdapter {
    private registerUserUsecase: IRegisterUser;
    // private createRoleUsecase: ICreateRole;
    constructor(
        registerUserUsecase: IRegisterUser,
    //    createRoleUsecase: ICreateRole,
      ) {
        this.registerUserUsecase = registerUserUsecase;
        // this.createRoleUsecase = createRoleUsecase;
      }

      run(): void {
        let user = this.registerUserUsecase.run("owner", "owner", "owner");
        if (!user) {
            monitor.error("Error registering Owner user");
        }
        monitor.info("Owner user registered");
        // this.createRoleUsecase.run(new Role({name: "Owner", isLeastPrivilege: false, roleType: RoleType.OWNER}));
      }

      stop(): void {
          
      }
}
