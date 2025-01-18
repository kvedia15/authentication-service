import { Router } from "express";
import {
  ICreateRole,
  IGetAllRoles,
  IGetRole,
  IUpdateRole,
  IValidateToken,
} from "../../../../core/ports/usecases";
import Role, { RoleType } from "../../../../core/domain/role";
import { randomUUID, UUID } from "crypto";
import { validate as validateUUID } from "uuid";
import { toRoleResponse } from "../serialiser";
import { authorize } from "../middlewares/authorization";

const roleRouter = Router();

export class RoleRoutes {
  constructor(
    private createRole: ICreateRole,
    private getAllRoles: IGetAllRoles,
    private getRole: IGetRole,
    private updateRole: IUpdateRole,
    private validateToken: IValidateToken
  ) {
    this.initRoutes();
  }
  public GetRouter() {
    return roleRouter;
  }

  private initRoutes() {
    roleRouter.get(
      "/api/v1/roles",
      authorize(
        [RoleType.ADMIN, RoleType.OWNER, RoleType.USER],
        this.validateToken
      ),
      async (req, res) => {
        let limit = req.query.limit as string | undefined;
        let offset = req.query.offset as string | undefined;

        if (!limit) {
          limit = "10";
        }
        if (!offset) {
          offset = "0";
        }

        const limitInt = parseInt(limit, 10);
        const roles = await this.getAllRoles.run(
          limitInt,
          parseInt(offset, 10)
        );
        res.status(200).json(roles);
      }
    );

    roleRouter.get(
      "/api/v1/roles/:id",
      authorize(
        [RoleType.ADMIN, RoleType.OWNER, RoleType.USER],
        this.validateToken
      ),
      async (req, res) => {
        const id = req.params.id;
        if (!validateUUID(id)) {
          return res.status(400).json({ message: "Invalid UUID" });
        }
        const idUuid: UUID = id as UUID;
        const role = await this.getRole.run(idUuid);
        res.status(200).json(toRoleResponse(role, ""));
      }
    );

    roleRouter.post(
      "/api/v1/roles",
      authorize([RoleType.ADMIN, RoleType.OWNER], this.validateToken),
      async (req, res) => {
        const { name, roleType, permissions, id } = req.body;
        let roleId: UUID | undefined;
        roleId = id;
        if (!name || !roleType) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        if (!roleId) {
          roleId = randomUUID();
        }
        const role = await this.createRole.run(
          new Role({
            id: roleId,
            name: name,
            roleType: roleType,
            permissions: permissions,
            // customPermissions: []
            
          })
        );
        if (!role) {
          return res.status(400).json({ message: "Failed to create role" });
        }
        res.status(201).json(toRoleResponse(role, ""));
      }
    );

    roleRouter.put(
      "/api/v1/roles/:id",
      authorize([RoleType.ADMIN, RoleType.OWNER], this.validateToken),
      async (req, res) => {
        const id = req.params.id;
        const { name, roleType, permissions } = req.body;
        if (!validateUUID(id)) {
          return res.status(400).json({ message: "Invalid UUID" });
        }
        const idUuid: UUID = id as UUID;

        if (!name || !roleType) {
          return res.status(400).json({ message: "Missing required fields" });
        }
        const role = await this.updateRole.run(
          new Role({
            id: idUuid,
            name: name,
            roleType: roleType,
            permissions: permissions,
            // customPermissions: []
          })
        );
        if (!role) {
          return res.status(404).json({ message: "Role not found" });
        }
        res.status(200).json(toRoleResponse(role, ""));
      }
    );
    roleRouter.delete(
      "/api/v1/roles/:id",
      authorize([RoleType.ADMIN, RoleType.OWNER], this.validateToken),
      async (req, res) => {
        const id = req.params.id;
        if (!validateUUID(id)) {
          return res.status(400).json({ message: "Invalid UUID" });
        }
        const idUuid: UUID = id as UUID;
        const role = await this.getRole.run(idUuid);
        if (!role) {
          return res.status(404).json({ message: "Role not found" });
        }
        const deletedRole = await this.updateRole.run(
          new Role({
            id: idUuid,
            name: role.Name,
            roleType: role.RoleType,
            permissions: role.Permissions,
            // customPermissions: []

          })
        );
        if (!deletedRole) {
          return res.status(400).json({ message: "Failed to delete role" });
        }
        res.status(200).json(toRoleResponse(deletedRole, ""));
      }
    );
  }
}
