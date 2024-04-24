type ChannelTypes = "direct" | "group";

interface IChannel {
	admins?: [object]; // admin will be populated if and only if channelType is 'group'
	members: [object];
	channelType: ChannelTypes;
	directChannelMergedIds?: string; // merged two Ids into a string with '-' e.g. ("userId1-userId2") if and only if channelType = "direct"
}

interface IFetchChannelReqParam {
	channelId: string;
}
