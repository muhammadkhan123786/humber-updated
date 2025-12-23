import { Router } from "express";
import { userRegister } from "../controllers/auth.controller";
import { registerShopDetails } from "../controllers/shop.controller";
import { upload } from "../config/multer";

const shopRouter = Router();

shopRouter.post('/shop', upload.single('logo'), userRegister, registerShopDetails)

export default shopRouter;