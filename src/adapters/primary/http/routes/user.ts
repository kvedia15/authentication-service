import { Router } from "express";
import {
  IRegisterUser,
  IAuthenticateUser,
  ILogoutUser,
  IRefreshToken,
  IGetAllRoles,
  IValidateToken,
  IGetUser,
  IGetAllUsers,
  IUpdateUser,
  ICreateUser,
} from "../../../../core/ports/usecases";
import { toUserResponse } from "../serialiser";
import { RoleType, toRoleType } from '../../../../core/domain/role';
import { authorize } from "../middlewares/authorization";
import User from "../../../../core/domain/user";
import { UUID } from 'crypto';

const userRouter = Router();

export class UserRoutes {
  constructor(
    private registerUserUsecase: IRegisterUser,
    private authenticateUserUsecase: IAuthenticateUser,
    private logoutUserUsecase: ILogoutUser,
    private refreshTokenUsecase: IRefreshToken,
    private getAllRolesUsecase: IGetAllRoles,
    private validateToken: IValidateToken,
    private getUserUsecase: IGetUser,
    private getAllUsersUsecase: IGetAllUsers,
    private updateUserUsecase: IUpdateUser,
  ) {
    this.initRoutes();
  }

  public GetRouter() {
    return userRouter;
  }

  private initRoutes() {
    userRouter.get("/api/v1/users", authorize([RoleType.OWNER, RoleType.ADMIN], this.validateToken), async (req, res) => {
      let limit = 10;
      let offset = 0;
      if (req.query.limit) {
        limit = parseInt(req.query.limit as string, 10);
      }
      if (req.query.offset) {
        offset = parseInt(req.query.offset as string, 10);
      }
      const users = await this.getAllUsersUsecase.run(limit, offset);

      let userRespArray : any = []
      for (const user of users) {

        let userResp = toUserResponse(user, "");
        userRespArray.push(userResp)
      }
      return res.status(200).json(userRespArray);
    })




    userRouter.post("/api/v1/users", async (req, res) => {
      const { username, password, email, role } = req.body;
      let assignedRole = role;
      if (!assignedRole) {
        assignedRole = RoleType.USER;
      } else {
        assignedRole = toRoleType(assignedRole.roleType);
      }
      if (!username || !password || !email) {
        return res
          .status(400)
          .json(toUserResponse(null, "Missing required fields"));
      }


      const registeredUser = await this.registerUserUsecase.run(
        username,
        password,
        email
      );

      if (!registeredUser.user) {
        return res
          .status(400)
          .json(toUserResponse(null, registeredUser.message));
      }

      return res.status(201).json(toUserResponse(registeredUser.user, "User created successfully"));
    });


    userRouter.post("/api/v1/users/login", async (req, res) => {
      try {
        const authenticatedUser = await this.authenticateUserUsecase.run(
          req.body.username,
          req.body.password
        );

        if (!authenticatedUser) {
          return res
            .status(401)
            .json(toUserResponse(null, "Username or password is incorrect"));
        }

        const refreshToken = authenticatedUser.RefreshToken;



        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false, // Set to true in production
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000
        });

        res.cookie("sessionToken", authenticatedUser.SessionToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(toUserResponse(authenticatedUser, ""));
      } catch (err) {
        return res
          .status(500)
          .json(toUserResponse(null, "Internal server error"));
      }
    });

    userRouter.post("/api/v1/users/logout", async (req, res) => {
      try {
        const refreshToken = req.cookies.refreshToken;
        const sessionToken = req.cookies.sessionToken;

        if (!refreshToken) {
          return res
            .status(400)
            .json(toUserResponse(null, "Refresh token missing"));
        }

        if (!sessionToken) {
          return res
            .status(400)
            .json(toUserResponse(null, "Session token missing"));
        }

        const user = await this.logoutUserUsecase.run(
          refreshToken,
          sessionToken
        );

        if (!user) {
          return res
            .status(401)
            .json(toUserResponse(null, "Invalid or expired refresh token"));
        }

        res.clearCookie("refreshToken", {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        res.clearCookie("sessionToken", {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });

        return res.status(200).json(toUserResponse(user, ""));
      } catch (err) {
        return res
          .status(500)
          .json(toUserResponse(null, "Internal server error"));
      }
    });

    userRouter.post("/api/v1/users/refresh-token", async (req, res) => {
      try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
          return res
            .status(400)
            .json(toUserResponse(null, "Refresh token missing"));
        }

        const user = await this.refreshTokenUsecase.run(refreshToken);

        if (!user) {
          return res
            .status(401)
            .json(toUserResponse(null, "Invalid or expired refresh token"));
        }
        res.cookie("sessionToken", user.SessionToken, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(toUserResponse(user, ""));
      } catch (err) {
        return res
          .status(500)
          .json(toUserResponse(null, "Internal server error"));
      }
    });
    userRouter.put("/api/v1/users/:id", async (req, res) => {
      const { id } = req.params;
      if (!id) {
        return res
          .status(400)
          .json(toUserResponse(null, "Missing user id"));
      } 
      const { username, password, email } = req.body;
      const user = await this.updateUserUsecase.run(new User({
        id: id as UUID,
        username: username,
        password: password,
        email: email
      }));
      return res.status(200).json(toUserResponse(user, ""));
    });
  }

}

export default userRouter;
