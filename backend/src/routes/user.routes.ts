// routes/user.routes.ts
import { Router } from "express";
import {
  getAllUsers,
  getUserStats,
  toggleUserLock,
  getUserById,
  createUserByAdmin,
} from "../controllers/user.controller";
import { adminProtecter } from "../middleware/auth.middleware";

const userRouter = Router();

// All routes require admin authentication
userRouter.use(adminProtecter);

// User management routes
userRouter.get("/stats", getUserStats);
userRouter.get("/", getAllUsers);
userRouter.get("/id/:id", getUserById);
userRouter.post("/", createUserByAdmin);
userRouter.patch("/:id/lock", toggleUserLock);

export default userRouter;
// const userRouter = Router();

// // ✅ Use adminProtecter – ensures only Admins can create users
// userRouter.post("/add", adminProtecter, createUserByAdmin);

// export default userRouter;
