import Table from "../../../core/domain/table";
import User from "../../../core/domain/user";
import {
  validate as uuidValidate,
} from "uuid";
import { UUID } from "crypto";
import monitor from "../../../monitor";

export function toUserResponse(user: User | null, errorMessage: string) {
    if (!user) {
      return {
        success: false,
        error_message: errorMessage,
        user: {},
      };
    }
    return {
      success: true,
      errorMessage: "",
      user: user.toJSON(),
    };
  }


  export function toTableResponse(table: Table | null, errorMessage: string) {
    if (!table) {
      return {
        success: false,
        errorMessage: errorMessage,
        table: {},
      };
    }
    return {
      success: true,
      errorMessage: "",
      table: table.toJSON(),
    };
  }

  export function toUUID(uuidString: string): UUID | null {
    if (!uuidValidate(uuidString)) {
      monitor.error(`Invalid UUID string: ${uuidString}`);
      return null;
    }
    return uuidString as UUID;
  }