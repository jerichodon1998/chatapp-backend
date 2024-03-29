type ChannelTypes = "direct" | "group";

interface IChannel {
	admins?: [object];
	members: [object];
	channelType: ChannelTypes;
}

interface IFetchChannelReqParam {
	channelId: string;
}
