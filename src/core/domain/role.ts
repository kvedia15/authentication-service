import { randomUUID, UUID } from "crypto";
import { Optional } from "./result";
import { Permission } from "./permission";




export enum RoleType {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  USER = "USER",
}

export function toRoleType(value: string): Optional<RoleType> {
  return Object.values(RoleType).includes(value as RoleType) ? (value as RoleType) : null;
}


export default class Role {
  id: UUID;
  name: string;
  roleType: RoleType;
  permissions: Permission[];
  createdAt: Date;
  updatedAt: Date;
  isLeastPrivilege: boolean;
  // customPermissions: Permission[]

  constructor({
    id,
    name,
    roleType,
    permissions,
    createdAt,
    updatedAt,
    isLeastPrivilege,
  }: // customPermissions,
  {
    id?: UUID;
    name: string;
    roleType?: RoleType;
    permissions?: Permission[];
    createdAt?: Date;
    updatedAt?: Date;
    isLeastPrivilege?: boolean;
    // customPermissions: Permission[];
  }) {
    this.id = id || randomUUID();
    this.name = name;
    this.roleType = roleType || RoleType.USER;
    this.permissions = permissions || [];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
    this.isLeastPrivilege = isLeastPrivilege || false;
    // this.customPermissions = customPermissions || []
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

  public get Permissions(): Permission[] {
    return this.permissions;
  }
}
