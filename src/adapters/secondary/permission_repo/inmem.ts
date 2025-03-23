import { UUID } from "crypto";
import { Permission } from "../../../core/domain/permission";
import { Optional } from "../../../core/domain/result";
import { IPermissionRepo } from "../../../core/ports/secondary";

export class InMemPermissionRepo implements IPermissionRepo {
  permissions: Map<UUID, Permission>;
  rolePermissions: Map<UUID, Permission[]>;
  constructor() {
    this.permissions = new Map();
    this.rolePermissions = new Map();
  }
  public async createPermission(permission: Permission): Promise<Optional<Permission>> {
    this.permissions.set(permission.id, permission);
    return permission;
  }
  public async getAllPermissions(limit: number, offset: number): Promise<Permission[]> {
    return Array.from(this.permissions.values());
  }
  public async getPermission(id: UUID): Promise<Optional<Permission>> {

    let permission = this.permissions.get(id);
    if (!permission) {
      return null;
    }
    return permission;
  }
  public async getPermissionsByRole(id: UUID): Promise<Permission[]> {

    let permissions = this.rolePermissions.get(id);
    if (!permissions) {
      return [];
    }
    return permissions;
  }
  public async updatePermission(permission: Permission): Promise<Optional<Permission>> {

    this.permissions.set(permission.id, permission);
    return permission;
  }
  public async deletePermission(id: UUID): Promise<boolean> {
    this.permissions.delete(id);
    return true;
  }
}
