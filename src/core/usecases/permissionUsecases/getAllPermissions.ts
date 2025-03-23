import { Permission } from "../../domain/permission";
import { IPermissionRepo } from "../../ports/secondary";
import { IGetAllPermissions } from "../../ports/usecases";

export class GetAllPermissions implements IGetAllPermissions {
    constructor(private permissionRepo: IPermissionRepo) {}
    async run(limit: number, offset: number): Promise<Permission[]> {
        return await this.permissionRepo.getAllPermissions(limit, offset);
    }
}