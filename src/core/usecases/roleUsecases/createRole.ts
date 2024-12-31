import Role from "../../domain/role";
import { IRoleRepo } from "../../ports/secondary";
import { ICreateRole } from "../../ports/usecases";

export class CreateRole implements ICreateRole {
    roleRepo: IRoleRepo
    constructor(
        roleRepo: IRoleRepo
    ) {
        this.roleRepo = roleRepo;
    }
    run(role: Role): Promise<Role | null> {
        return this.roleRepo.createRole(role);
    }
}