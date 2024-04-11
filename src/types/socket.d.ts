type ICallbackResponse = (response: {
	status: number;
	message: string;
}) => void;

interface ISendMessageSocketPayload extends ISendMessage {}
interface IDeleteMessageSocketPayload {
	messageId: string;
}
interface IEditMessageSocketPayload {
	messageId: string;
	content: string;
}
