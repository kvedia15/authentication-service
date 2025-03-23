import { Permission } from '../../domain/permission';
import { Optional } from '../../domain/result';
import { IPermissionRepo } from '../../ports/secondary';
import { IUpdatePermission } from '../../ports/usecases';
export class UpdatePermission implements IUpdatePermission {
    constructor(private permissionRepo : IPermissionRepo) {}
    async run(permission: Permission): Promise<Optional<Permission>> {
        return await this.permissionRepo.updatePermission(permission);
    }
}