import { UUID } from "crypto";
import Role from "../../domain/role";
import { IPermissionRepo, IRoleRepo } from "../../ports/secondary";
import { IGetRole } from "../../ports/usecases";
import { Optional } from "../../domain/result";

export class GetRole implements IGetRole {
    roleRepo: IRoleRepo
    permissionRepo: IPermissionRepo
    constructor(
        roleRepo: IRoleRepo,
        permissionRepo: IPermissionRepo
    ) {
        this.roleRepo = roleRepo;
        this.permissionRepo = permissionRepo;
    }
   public async run(id: UUID): Promise<Optional<Role>> {
        let role = await this.roleRepo.getRole(id)
        if (role) {
            let permissions = await this.permissionRepo.getPermissionsByRole(id)
            role.permissions = permissions;
        }
        return role;
    }
}