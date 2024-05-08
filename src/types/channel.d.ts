import { Schema } from "mongoose";

export type ChannelTypes = "direct" | "group";

export interface IChannel {
	admins?: [Schema.Types.ObjectId]; // admin will be populated if and only if channelType is 'group'
	members: [Schema.Types.ObjectId];
	channelType: ChannelTypes;
	directChannelMergedIds?: string; // merged two Ids into a string with '-' e.g. ("userId1-userId2") if and only if channelType = "direct"
}

export interface IFetchChannelReqParam {
	channelId: string;
}
