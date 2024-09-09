<script lang="ts">
	let email = ''
	let message = ''
	let success = false

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault()

		try {
			const response = await fetch('/api/subscribe', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email }),
			})

			const result = await response.json()
			console.log('result: ', result)

			if (response.ok) {
				success = true
				message = result.success
				email = ''
			} else {
				success = false
				message = result.error
			}
		} catch (error) {
			success = false
			message = 'An unexpected error occurred.'
		}
	}
</script>

<form on:submit={handleSubmit}>
	<label for="emailrjgor">Email:</label>
	<input
		class="text-black"
		type="email"
		id="emailrjgor"
		name="emailrjgor"
		bind:value={email}
		required
	/>
	<label class="ohnohoney" for="email"></label>
	<input
		class="ohnohoney"
		autocomplete="off"
		type="email"
		id="email"
		name="email"
		placeholder="Your e-mail here"
	/>
	<button type="submit" class="bg-black text-white">Subscribe</button>
</form>

{#if message}
	<p class={success ? 'success' : 'error'}>{message}</p>
{/if}

<style>
	.ohnohoney {
		opacity: 0;
		position: absolute;
		top: 0;
		left: 0;
		height: 0;
		width: 0;
		z-index: -1;
	}
</style>
