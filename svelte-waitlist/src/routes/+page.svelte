<script lang="ts">
	import { onMount } from 'svelte';
	import { sendMessage } from '$lib/service/sendMessage';
	import Divider from '$lib/components/Divider.svelte';
	import { sendMessageOnThread, createThread, listMessages } from '$lib/service/assistantApi';

	let counter = 0;

	let aiMessage = '';
	let displayedMessage = '';
	let threadId = '';

	let isLoading = true;

	let userMessage: string;
	var regexEmail = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

	function handleKeyPress(event: { key: string }) {
		if (event.key === 'Enter') {
			postMessage();
		}
	}

	/**
	 * Functions util to show text with real effect
	 */
	async function showMessage() {
		for (let i = 0; i < aiMessage.length; i++) {
			displayedMessage = aiMessage.substring(0, i + 1);
			await sleep(30);
		}
	}

	function sleep(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}

	/**
	 * OpenAI calls and logic
	 */

	async function postMessage() {
		isLoading = true;
		if (regexEmail.test(userMessage)) {
			try {
				sendMessage('someone send this message to you on mastrogpt: ' + userMessage);
			} catch (error) {
				console.log('Error while sending message', error);
			}
		}

		if (threadId.length > 0) {
			await sendMessageOnThread(threadId, userMessage);
			await listLastAimessage();
		}
	}

	async function listLastAimessage() {
		await sleep(1500);
		try {
			counter += 1;
			if (counter > 9) {
				aiMessage = 'Sorry, but this model is going to sleep :(';
				await showMessage();
				location.reload();
			}

			const result = await listMessages(threadId);
			const aiNewMessage = result;
			if (aiNewMessage.length > 0) {
				if (aiNewMessage === aiMessage) {
					await listLastAimessage();
				} else {
					aiMessage = aiNewMessage;
					isLoading = false;
					counter = 0;
				}
			} else {
				await listLastAimessage();
			}
			showMessage();
		} catch (error) {
			if (counter > 9) {
				console.error('Error during listLastAimessage:', error);
				location.reload();
			} else {
				await listLastAimessage();
			}
		}
	}

	onMount(async () => {
		threadId = await createThread();
		if (threadId) {
			isLoading = false;
		}

		aiMessage =
			"Welcome to MastroGPT.com. I'm here to assist you and provide all the information you need. If everything is clear, please enter your email and click on submit to join our waitlist! Otherwise, feel free to ask anything!";
		if (aiMessage) {
			showMessage();
		}
	});
</script>

<svelte:head>
	<title>MastroGPT</title>
	<meta name="og:title" content="MastroGPT" />
</svelte:head>

<div>
	<Divider />
	<div class="text-xl text-primary font-bold text-center mt-2">
		Welcome. Here, you can ask any question <br />
		to our AI secretary or insert your email to join our waitlist 👇
	</div>

	<div class="grid grid-cols-1 gap-4 lg:grid-cols-2 border-primary lg:gap-8 border rounded m-5 p-5">
		<div class="h-50 border border-primary rounded bg-slate-200 shadow-md p-2">
			{#if aiMessage.length <= 0 || isLoading}
				<div class="flex justify-center items-center h-30 p-10">
					<div class="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
				</div>
			{:else}
				{displayedMessage}
			{/if}
		</div>

		<div>
			<label for="askSomething" class="sr-only">Ask something to this model...</label>

			<div class="border border-primary rounded shadow-lg p-2">
				<textarea
					maxlength="200"
					id="askSomething"
					class="w-full border-none text-l"
					rows="3"
					placeholder="Pose a question or simply put your email here to join our waitlist!"
					bind:value={userMessage}
					on:keypress={handleKeyPress}
				/>

				<div class="flex items-center justify-end gap-2 bg-white pt-2">
					{#if !isLoading}
						<button
							type="button"
							class="rounded bg-light px-3 py-1.5 text-l font-medium text-white hover:bg-primary"
							on:click={postMessage}
						>
							Submit
						</button>
					{:else}
						<button
							type="button"
							class="rounded bg-slate-200 px-3 py-1.5 text-l font-medium text-white"
						>
							Submit
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
