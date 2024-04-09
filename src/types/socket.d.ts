type ICallbackResponse = (response: {
	status: number;
	message: string;
}) => void;

interface ISendMessageSocketPayload extends ISendMessage {}
interface IDeleteMessageSocketPayload extends IDeleteMessageReqParam {}
interface IEditMessageSocketPayload {
	messageId: string;
	content: string;
}
