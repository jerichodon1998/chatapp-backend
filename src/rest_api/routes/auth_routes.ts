import { Router } from "express";
import signinController from "../controllers/auth_controllers/signin_controller";
import signupController from "../controllers/auth_controllers/signup_controller";
import persistController from "../controllers/auth_controllers/persist_controller";
import { verifyToken } from "../middlewares/token_middlewares/jwt_token_middleware";

const router = Router();

router.post("/signin", signinController);
router.post("/signup", signupController);
router.get("/persist", [verifyToken], persistController);

export default router;
