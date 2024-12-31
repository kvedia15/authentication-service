import { Router } from "express";
import {
  ICreateRole,
  IGetAllRoles,
  IGetRole,
  IUpdateRole,
} from "../../../../core/ports/usecases";
import Role from "../../../../core/domain/role";
import { UUID } from 'crypto';
import { validate as validateUUID } from "uuid";
import { toRoleResponse } from "../serialiser";

const roleRouter = Router();

export class RoleRoutes {
  constructor(
    private createRole: ICreateRole,
    private getAllRoles: IGetAllRoles,
    private getRole: IGetRole,
    private updateRole: IUpdateRole
  ) {
    this.initRoutes();
  }
  public GetRouter() {
    return roleRouter;
  }

  private initRoutes() {
    roleRouter.get("/api/v1/roles", async (req, res) => {
        let limit = req.query.limit as string | undefined;
        let offset = req.query.offset as string | undefined;
    
        if (!limit) {
          limit = "10";
        }
        if (!offset) {
          offset = "0";
        }
    
        const limitInt = parseInt(limit, 10);
        const roles = await this.getAllRoles.run(limitInt, parseInt(offset, 10));
        res.status(200).json(roles);
      });

    roleRouter.get("/api/v1/roles/:id", async (req, res) => {
      const id = req.params.id;
      if (!validateUUID(id)) {
        return res.status(400).json({ message: "Invalid UUID" });
      }
      const idUuid: UUID = id as UUID;  
      const role = await this.getRole.run(idUuid);
      res.status(200).json(toRoleResponse(role, ""));
    });

    roleRouter.post("/api/v1/roles", async (req, res) => {
      const { name, roleType, permissions } = req.body;
        
      if (!name || !roleType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const role = await this.createRole.run(new Role({ name: name, roleType: roleType, permissions: permissions }));
      if (!role) {
        return res.status(400).json({ message: "Failed to create role" });
      }
      res.status(201).json(toRoleResponse(role, ""));
    });

    roleRouter.put("/api/v1/roles/:id", async (req, res) => {
      const id = req.params.id;
      const { name, roleType, permissions } = req.body;
      if (!validateUUID(id)) {
        return res.status(400).json({ message: "Invalid UUID" });
      }
      const idUuid: UUID = id as UUID;


      if (!name || !roleType) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const role = await this.updateRole.run(new Role({id: idUuid, name: name, roleType: roleType, permissions: permissions }));
      if (!role) {
        return res.status(404).json({ message: "Role not found" });
      }
      res.status(200).json(toRoleResponse(role, ""));
    });

  }
}
