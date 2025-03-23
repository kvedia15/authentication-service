import { UUID } from "crypto";
import { Optional } from "./result";

export class Permission {
    id: UUID;
    name: string;
    permissionAction: Optional<string>;
  
    constructor({
      id,
      name,
      permissionAction,
    }: {
      id: UUID;
      name: string;
      permissionAction: Optional<string>;
    }) {this.id = id
      this.name = name
      this.permissionAction = permissionAction
    }
  }