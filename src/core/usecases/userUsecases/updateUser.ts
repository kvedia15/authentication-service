import { Optional } from "../../domain/result";
import User from "../../domain/user";
import { IUserRepo } from "../../ports/secondary";
import { IUpdateUser } from "../../ports/usecases";

export default class UpdateUser implements IUpdateUser {
    constructor(private userRepo: IUserRepo) {}
    public async run(user: User): Promise<Optional<User>> {
        return await this.userRepo.updateUser(user);
    }
}