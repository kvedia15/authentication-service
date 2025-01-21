import { UUID } from "crypto";
import { Optional } from "../../domain/result";
import User from "../../domain/user";
import { IUserRepo } from "../../ports/secondary";
import { ICreateUser, IDeleteUser, IGetAllUsers, IGetUser } from "../../ports/usecases";

export default class DeleteUser implements IDeleteUser {
    constructor(private userRepo: IUserRepo) {}
    async run(id: UUID): Promise<boolean> {
        return await this.userRepo.deleteUser(id);
    }
}