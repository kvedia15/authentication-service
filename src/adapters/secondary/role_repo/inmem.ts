import { UUID } from "crypto";
import Role from "../../../core/domain/role";
import { IRoleRepo } from "../../../core/ports/secondary";
import monitor from "../../../monitor";

export class InMemRoleRepo implements IRoleRepo {
    roles : Map<UUID, Role>
    constructor() {
        this.roles = new Map(
        );
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

    public async getLeastPrivilegedRole(): Promise<Role | null> {
        try {
            return Array.from(this.roles.values()).find(role => role.isLeastPrivilege) || null;
        } catch (e) {
            monitor.error("Error getting least privileged role", e);
            return null;
        }
    }
}