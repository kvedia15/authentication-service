import Role from "../../domain/role";
import { IRoleRepo } from "../../ports/secondary";
import { IUpdateRole } from "../../ports/usecases";

export class UpdateRole implements IUpdateRole {
    roleRepo: IRoleRepo
    constructor(
        roleRepo: IRoleRepo
    ) {
        this.roleRepo = roleRepo;
    }
    run(role: Role): Promise<Role | null> {
        return this.roleRepo.updateRole(role);
    }
}