import { Router } from "express";
import fetchChannelController from "../controllers/channel_controllers/fetch_channel_controller";
import deleteChannelController from "../controllers/channel_controllers/delete_channel_controller";

const router = Router();

router.get("/:channelId", fetchChannelController);
router.delete("/:channelId", deleteChannelController);

export default router;
