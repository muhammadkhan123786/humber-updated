import { Router } from "express";
import { login, setupPassword } from "../controllers/auth.controller";


const authRouter = Router();

authRouter.post('/login', login);
authRouter.put('/setup-password', setupPassword)

export default authRouter;