import Role from "../../domain/role";
import { IRoleRepo } from "../../ports/secondary";
import { IGetAllRoles } from "../../ports/usecases";

export class GetAllRoles implements IGetAllRoles {
    roleRepo: IRoleRepo
    constructor(
        roleRepo: IRoleRepo
    ) {
        this.roleRepo = roleRepo;
    }
    public async run(limit: number, offset: number): Promise<Role[]> {
        return this.roleRepo.getAllRoles(limit, offset);
    }
}