import { Permission } from '../../domain/permission';
import { Optional } from '../../domain/result';
import { IPermissionRepo } from '../../ports/secondary';
import { ICreatePermission } from '../../ports/usecases';
export class CreatePermission implements ICreatePermission {
    constructor(private permissionRepo : IPermissionRepo) {}
    public async run(permission: Permission): Promise<Optional<Permission>> {
        return await this.permissionRepo.createPermission(permission);
    }
}