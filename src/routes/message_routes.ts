import { Router } from "express";
import sendMessageController from "../controllers/message_controllers/send_message_controller";
import updateMessageController from "../controllers/message_controllers/update_message_controller";
import deleteMessageController from "../controllers/message_controllers/delete_message_controller";
import {
	verifyDeleterToken,
	verifySenderToken,
} from "../middlewares/token_middlewares/jwt_token_middleware";

const router = Router();

router.post("/", verifySenderToken, sendMessageController);
router.put("/:messageId", updateMessageController);
router.delete("/:messageId", verifyDeleterToken, deleteMessageController);

export default router;
