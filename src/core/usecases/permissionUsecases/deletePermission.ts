import { UUID } from "crypto";
import { IPermissionRepo } from "../../ports/secondary";
import { IDeletePermission } from "../../ports/usecases";

export class DeletePermission implements IDeletePermission {
    constructor(private permissionRepo : IPermissionRepo) {}

    public async run (id: UUID): Promise<boolean> {
        return await this.permissionRepo.deletePermission(id);  
    }
}