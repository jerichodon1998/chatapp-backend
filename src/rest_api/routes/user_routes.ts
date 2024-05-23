import { Router } from "express";
import deleteAccountController from "../controllers/user_controllers/delete_account_controller";
import { verifyAccountDeleterToken } from "../middlewares/token_middlewares/jwt_token_middleware";

const router = Router();

router.delete("/:uid", verifyAccountDeleterToken, deleteAccountController);

export default router;
