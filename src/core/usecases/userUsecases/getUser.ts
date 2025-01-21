import { Optional } from "../../domain/result";
import User from "../../domain/user";
import { IUserRepo } from "../../ports/secondary";
import { IGetUser } from "../../ports/usecases";

export default class GetUser implements IGetUser {
    constructor(private userRepo: IUserRepo) {}
    async run(username: string): Promise<Optional<User>> {
        return await this.userRepo.getUser(username);
    }
}