import { Optional } from "../../domain/result";
import User from "../../domain/user";
import { IUserRepo } from "../../ports/secondary";
import { IGetAllUsers, IGetUser } from "../../ports/usecases";

export default class GetAllUsers implements IGetAllUsers {
    constructor(private userRepo: IUserRepo) {}
    public async run(limit: number, offset: number): Promise<User[]> {
        return await this.userRepo.getAllUsers(limit, offset);
    }
}