import axios from 'axios';
import { PUBLIC_URL_CREATE_THREAD } from '$env/static/public';
import { PUBLIC_URL_SEND_MESSAGE_ON_THREAD } from '$env/static/public';
import { PUBLIC_URL_LIST_MESSAGE } from '$env/static/public';

export async function createThread(): Promise<string> {
	const apiUrl = PUBLIC_URL_CREATE_THREAD;

	try {
		const response = await axios.post(apiUrl);
		if (response.data && response.data.id) {
			return response.data.id as string;
		} else {
			throw new Error('thread id not present');
		}
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}

export async function sendMessageOnThread(threadId: string, message: string) {
	const apiUrl = PUBLIC_URL_SEND_MESSAGE_ON_THREAD;
	const headers = {
		'Content-Type': 'application/json'
	};

	const requestData = {
		threadId: threadId,
		message: message
	};

	axios
		.post(apiUrl, requestData, { headers })
		.catch((error) => {
			console.error('Error:', error);
		});
}

export async function listMessages(threadId: string): Promise<any> {
	const apiUrl = PUBLIC_URL_LIST_MESSAGE;
	const headers = {
		'Content-Type': 'application/json'
	};

	const requestData = {
		threadId: threadId
	};

	try {
		const response = await axios.post(apiUrl, requestData, { headers });
		return response.data;
	} catch (error) {
		console.error('Error:', error);
		throw error;
	}
}
