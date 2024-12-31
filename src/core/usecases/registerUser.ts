import { IRoleRepo, IUserRepo } from "../../core/ports/secondary";
import { IRegisterUser } from "../ports/usecases";
import bcrypt from "bcrypt";
import User from "../../../src/core/domain/user";
import monitor from "../../monitor";
import Role from '../domain/role';

export class RegisterUser implements IRegisterUser {
  private userRepo: IUserRepo;
  private roleRepo: IRoleRepo;
  constructor(userRepo: IUserRepo, roleRepo: IRoleRepo) {
    this.userRepo = userRepo;
    this.roleRepo = roleRepo;
  }
  async run(
    username: string,
    password: string,
    email: string,
    role?: Role
  ): Promise<{ user: User | null; message: string }> {
    const saltRounds = 10;
    if (password === "") {
      return { user: null, message: "Password cannot be empty" };
    }
    let existingUser = await this.userRepo.getUser(username);
    if (existingUser) {
      monitor.info("User already exists");
      return { user: null, message: "User already exists" };
    }
    try {
      const passwordHash = await bcrypt.hash(password, saltRounds);
      const registeredUser = await this.userRepo.createUser(
        username,
        passwordHash,
        email,
        role
      );
      if (!registeredUser) {
        return { user: null, message: "An error occurred while registering the user" };
      }
      
      if (!role){
        let leastPrivilegeRole = await this.roleRepo.getLeastPrivilegedRole();
        if (!leastPrivilegeRole) {
          monitor.error("Error getting least privileged role");
          return { user: null, message: "An error occurred while getting the least privileged role" };
        }
        registeredUser.Role = leastPrivilegeRole ;
      }else {
        registeredUser.Role = role;
      }
      return { user: registeredUser, message: "" };
    } catch (error) {
      monitor.error("Error hashing password", error);
      return { user: null, message: "An error occurred while hashing the password" };
    }
  }
}
