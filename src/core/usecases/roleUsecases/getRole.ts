import { UUID } from "crypto";
import Role from "../../domain/role";
import { IRoleRepo } from "../../ports/secondary";
import { IGetRole } from "../../ports/usecases";

export class GetRole implements IGetRole {
    roleRepo: IRoleRepo
    constructor(
        roleRepo: IRoleRepo
    ) {
        this.roleRepo = roleRepo;
    }
    run(id: UUID): Promise<Role | null> {
        return this.roleRepo.getRole(id);
    }
}