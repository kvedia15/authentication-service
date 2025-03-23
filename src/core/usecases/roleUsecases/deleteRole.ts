import { UUID } from "crypto";
import { IRoleRepo } from "../../ports/secondary";
import { IDeleteRole} from "../../ports/usecases";

export class DeleteRole implements IDeleteRole {
    roleRepo: IRoleRepo
    constructor(
        roleRepo: IRoleRepo
    ) {
        this.roleRepo = roleRepo;
    }
    public async run(id: UUID): Promise<boolean> {
        return this.roleRepo.deleteRole(id);
    }
}