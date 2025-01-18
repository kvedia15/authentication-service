import { UUID } from "crypto";
import Role from "../../domain/role";
import { IRoleRepo } from "../../ports/secondary";
import { IGetRole } from "../../ports/usecases";
import { Optional } from "../../domain/result";

export class GetRole implements IGetRole {
    roleRepo: IRoleRepo
    constructor(
        roleRepo: IRoleRepo
    ) {
        this.roleRepo = roleRepo;
    }
   async run(id: UUID): Promise<Optional<Role>> {
        let role = await this.roleRepo.getRole(id)
        return role;
    }
}