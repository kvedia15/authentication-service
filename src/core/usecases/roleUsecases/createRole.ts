import { Optional } from "../../domain/result";
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
    async run(role: Role): Promise<Optional<Role>> {
        const createdRole = await this.roleRepo.createRole(role);
        return createdRole
    }
}