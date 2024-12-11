import express from "express";
import authCtr from "./auth.service.js";
import authMiddleware from "../../../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/signin", authCtr.login);
authRouter.post("/signin/new_token", authCtr.refreshTokens);
authRouter.post("/signup", authCtr.register);
authRouter.get("/info", authMiddleware, authCtr.userInfo);
authRouter.get("/logout", authMiddleware, authCtr.logout);

export default authRouter;
