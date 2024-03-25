import { Router } from "express";
import sendMessageController from "../controllers/message_controllers/send_message_controller";

const router = Router();

router.post("/", sendMessageController);

export default router;
