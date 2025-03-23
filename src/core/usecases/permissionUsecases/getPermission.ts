import { UUID } from "crypto";
import { Permission } from "../../domain/permission";
import { IPermissionRepo } from "../../ports/secondary";
import { IGetPermission } from "../../ports/usecases";
import { Optional } from "../../domain/result";

export class GetPermission implements IGetPermission {
    constructor(private permissionRepo: IPermissionRepo) {}
    async run (id: UUID): Promise<Optional<Permission>> {
        return await this.permissionRepo.getPermission(id);
    }
}