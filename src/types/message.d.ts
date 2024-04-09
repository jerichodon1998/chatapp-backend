interface IMessage {
	content: string;
	channelId: object;
	authorId: object;
}

interface ISendMessage {
	content: string;
	recipientId?: string;
	authorId: string;
	channelType: ChannelTypes;
	channelId?: string;
}
interface ISendMessageReqBody extends ISendMessage {}

interface IDeleteMessageReqParam {
	messageId: string;
}

interface IEditMessageReqParam {
	messageId: string;
}
