// routes/user.routes.ts
import { Router } from "express";
import { createUserByAdmin } from "../controllers/user.controller";
import { adminProtecter } from "../middleware/auth.middleware";

const userRouter = Router();

// ✅ Use adminProtecter – ensures only Admins can create users
userRouter.post("/add", adminProtecter, createUserByAdmin);

export default userRouter;