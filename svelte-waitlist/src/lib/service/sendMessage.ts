import axios from 'axios';
import { PUBLIC_URL_NOTIFY_SLACK } from '$env/static/public';

export async function sendMessage(userMessage: string) {
	const headers = {
		'Content-Type': 'application/json'
	};
	const data = {
		text: userMessage
	};

	axios
		.post(PUBLIC_URL_NOTIFY_SLACK, data, { headers })
		.then((response) => {
			console.log(response.status);
		})
		.catch((error) => {
			console.error(error);
		});
}
