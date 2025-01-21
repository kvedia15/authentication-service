import { Optional } from "../../domain/result";
import User from "../../domain/user";
import { IUserRepo } from "../../ports/secondary";
import { ICreateUser, IGetAllUsers, IGetUser } from "../../ports/usecases";

export default class CreateUser implements ICreateUser {
    constructor(private userRepo: IUserRepo) {}
    async run(user: User): Promise<Optional<User>> {
        return await this.userRepo.createUser(user);
    }
}