import { Router } from "express";
import { registerAccRouter } from "./registerAcc";
import { refreshTokenRouter } from "./refreshToken";;
import { getUsersRouter } from "./getUsers";
import { deleteUsersRouter } from "./deleteUser";
import { loginRouter } from "./login";

export const router = Router();

router.use("/register", registerAccRouter);
router.use("/refresh-token", refreshTokenRouter);
router.use("/delete-user", deleteUsersRouter);
router.use("/get-users", getUsersRouter);
router.use("/login", loginRouter)
