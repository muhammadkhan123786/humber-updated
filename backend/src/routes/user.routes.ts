import { Router } from "express";

const router = Router();

router.get('/', () => { console.log('Users') })

export default router;