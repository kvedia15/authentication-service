import { randomUUID, UUID } from "crypto";
import Role, { RoleType } from "../../../core/domain/role";
import { IRoleRepo } from "../../../core/ports/secondary";
import monitor from "../../../monitor";

export class InMemRoleRepo implements IRoleRepo {
    roles : Map<UUID, Role>
    constructor() {
        let basicRoleId = randomUUID()
        this.roles = new Map(

        );

        this.roles = new Map<UUID, Role>([
            [
              basicRoleId,
              new Role({id: basicRoleId, name: "Basic User", isLeastPrivilege: true, roleType: RoleType.USER}),
            ],
        ])
    }

    public async getAllRoles(): Promise<Role[]> {
        return Array.from(this.roles.values());
    }
    public async getRole(id: UUID): Promise<Role | null> {
        return this.roles.get(id) || null;
    } 
    public async createRole(role: Role): Promise<Role | null> {
        try {
            this.roles.set(role.id, role);
            return role;
        } catch (e) {
            monitor.error("Error creating role", e);
            return null;
        }
    }
    public async updateRole(role: Role): Promise<Role | null> {
        try {
            this.roles.set(role.id, role);
            return role;
        } catch (e) {
            monitor.error("Error creating role", e);
            return null;
        }
    }
    public async deleteRole(id: UUID): Promise<boolean> {
        try {
            this.roles.delete(id);
            return true;
        } catch (e) {
            monitor.error("Error deleting role", e);
            return false;
        }
    }
}