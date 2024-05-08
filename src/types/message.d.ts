import { Schema } from "mongoose";

export interface IMessage {
	content: string;
	channelId: Schema.Types.ObjectId;
	authorId: Schema.Types.ObjectId;
}

export interface ISendMessage {
	content: string;
	recipientId?: string;
	authorId: string;
	channelType: ChannelTypes;
	channelId?: string;
}
/* Express API */
export interface ISendMessageReqBody extends ISendMessage {}

export interface IDeleteMessageReqParam {
	messageId: string;
}

export interface IEditMessageReqParam {
	messageId: string;
}

/* Socket.io */
export interface ISendMessageSocketPayload extends ISendMessage {}
export interface IDeleteMessageSocketPayload {
	messageId: string;
}
export interface IEditMessageSocketPayload {
	messageId: string;
	content: string;
}
