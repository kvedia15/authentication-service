import { Router } from "express";
import {
  IRegisterUser,
  IAuthenticateUser,
  ILogoutUser,
  IRefreshToken,
  IGetAllRoles,
  IValidateToken,
} from "../../../../core/ports/usecases";
import { toUserResponse } from "../serialiser";
import { RoleType } from "../../../../core/domain/role";
import { authorize } from "../middlewares/authorization";

const userRouter = Router();

export class UserRoutes {
  constructor(
    private registerUserUsecase: IRegisterUser,
    private authenticateUserUsecase: IAuthenticateUser,
    private logoutUserUsecase: ILogoutUser,
    private refreshTokenUsecase: IRefreshToken,
    private getAllRoles: IGetAllRoles,
    private validateToken: IValidateToken
  ) {
    this.initRoutes();
  }

  public GetRouter() {
    return userRouter;
  }

  private initRoutes() {
    userRouter.post("/api/v1/users", async (req, res) => {
      const { username, password, email } = req.body;

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

      return res.status(201).json(toUserResponse(registeredUser.user, ""));
    });

    userRouter.post(
      "/api/v1/users/admin",
      authorize([RoleType.OWNER], this.validateToken),
      async (req, res) => {
        const { username, password, email } = req.body;

        if (!username || !password || !email) {
          return res
            .status(400)
            .json(toUserResponse(null, "Missing required fields"));
        }

        const roles = await this.getAllRoles.run(30, 0);
        const adminRole = roles.find(
          (role) => role.roleType === RoleType.ADMIN
        );
        if (!adminRole) {
          return res
            .status(400)
            .json(
              toUserResponse(
                null,
                "Admin role not found, please create one before registering an admin user"
              )
            );
        }
        const registeredUser = await this.registerUserUsecase.run(
          username,
          password,
          email,
          adminRole
        );
        if (!registeredUser.user) {
          return res
            .status(400)
            .json(toUserResponse(null, registeredUser.message));
        }
        return res.status(201).json(toUserResponse(registeredUser.user, ""));
      }
    );

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

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
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
          httpOnly: true,
          secure: true,
          sameSite: "strict",
        });

        res.clearCookie("sessionToken", {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
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
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(toUserResponse(user, ""));
      } catch (err) {
        return res
          .status(500)
          .json(toUserResponse(null, "Internal server error"));
      }
    });
  }
}

export default userRouter;
