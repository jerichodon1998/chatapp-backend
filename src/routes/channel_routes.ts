import { Router } from "express";
import fetchChannelController from "../controllers/channel_controllers/fetch_channel_controller";

const router = Router();

router.get("/:channelId", fetchChannelController);

export default router;
