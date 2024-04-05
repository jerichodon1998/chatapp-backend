import { Router } from "express";
import signinController from "../controllers/auth_controllers/signin_controller";
import signupController from "../controllers/auth_controllers/signup_controller";

const router = Router();

router.post("/signin", signinController);
router.post("/signup", signupController);

export default router;
