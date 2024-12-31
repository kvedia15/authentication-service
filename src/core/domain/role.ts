import { randomUUID, UUID } from "crypto";

export enum PermissionType {
  USER_MANAGEMENT = "USER_MANAGEMENT",
  PERMISSION_MANAGEMENT = "PERMISSION_MANAGEMENT",
  READ = "READ",
  WRITE = "WRITE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

export interface Permission {
  id: string;
  name: string;
  permissionType: PermissionType;
}

export enum RoleType {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  USER = "USER",
}

export default class Role {
  id: UUID;
  name: string;
  roleType: RoleType;
  permissions: PermissionType[];
  createdAt: Date;
  updatedAt: Date;
  isLeastPrivilege: boolean;

  constructor({
    id,
    name,
    roleType,
    permissions,
    createdAt,
    updatedAt,
    isLeastPrivilege,
  }: {
    id?: UUID;
    name: string;
    roleType?: RoleType;
    permissions?: PermissionType[];
    createdAt?: Date;
    updatedAt?: Date;
    isLeastPrivilege?: boolean;
  }
   
  ) {
    this.id = id || randomUUID();
    this.name = name;
    this.roleType = roleType || RoleType.USER;
    this.permissions = permissions || [PermissionType.READ];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.isLeastPrivilege = isLeastPrivilege || false;
  }

  public get Id(): UUID {
    return this.id;
  }

  public get Name(): string {
    return this.name;
  }

  public get RoleType(): RoleType {
    return this.roleType;
  }

  public get Permissions(): PermissionType[] {
    return this.permissions;
  }
}
