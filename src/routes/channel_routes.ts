import { Router } from "express";
import fetchChannelController from "../controllers/channel_controllers/fetch_channel_controller";
import deleteChannelController from "../controllers/channel_controllers/delete_channel_controller";
import { verifyChannelMember } from "../middlewares/token_middlewares/jwt_token_middleware";

const router = Router();

router.get("/:channelId", verifyChannelMember, fetchChannelController);
router.delete("/:channelId", deleteChannelController);

export default router;
