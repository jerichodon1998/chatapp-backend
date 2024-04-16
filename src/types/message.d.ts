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
/* Express API */
interface ISendMessageReqBody extends ISendMessage {}

interface IDeleteMessageReqParam {
	messageId: string;
}

interface IEditMessageReqParam {
	messageId: string;
}

/* Socket.io */
interface ISendMessageSocketPayload extends ISendMessage {}
interface IDeleteMessageSocketPayload {
	messageId: string;
}
interface IEditMessageSocketPayload {
	messageId: string;
	content: string;
}
