import { Router } from "express";
import { registerAccRouter } from "./registerAcc";
import { refreshTokenRouter } from "./refreshToken";

export const router = Router();

router.use("/register", registerAccRouter);
router.use("/refresh-token", refreshTokenRouter);