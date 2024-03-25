type ChannelTypes = "direct" | "group";

interface IChannel {
	admins?: [object];
	members: [object];
	channelType: ChannelTypes;
}
