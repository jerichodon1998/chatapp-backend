import { Router } from "express";
import signinController from "../controllers/auth_controllers/signin_controller";
import signupController from "../controllers/auth_controllers/signup_controller";
import logoutController from "../controllers/auth_controllers/logout_controller";

const router = Router();

router.post("/signin", signinController);
router.post("/signup", signupController);
router.post("/logout", logoutController);

export default router;
