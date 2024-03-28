interface IMessage {
	content: string;
	channelId: object;
	authorId: object;
}
interface ISendMessageReqBody {
	content: string;
	recipientId?: string;
	authorId: string;
	channelType: ChannelTypes;
	channelId?: string;
}
