<script lang="ts">
	import { page } from '$app/stores'
	import { goto } from '$app/navigation'
	import Icons from '../Icons.svelte'

	export let isOpen = false
	export let onClose = () => {} // Optional callback to handle close

	let value = $page.url.searchParams.get('q')

	async function submit(e: SubmitEvent) {
		let query = new URLSearchParams()
		if (value) {
			query.set('q', value)
		}

		await goto(`/search${query ? `?${query}` : ''}`, { keepFocus: true })
	}
</script>

<div class="search-container relative" class:open={isOpen}>
	<form on:submit|preventDefault={submit} class="grid">
		<input
			class="search-bar"
			type="text"
			bind:value
			placeholder="Search store"
			aria-label="Search Store"
		/>
		<button type="submit">
			<Icons type="search" />
		</button>
		<button on:click={onClose}>
			<Icons type="close" />
		</button>
	</form>
</div>

<style>
	.search-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: white;
		overflow: hidden;
		z-index: 2;
	}

	form {
		grid-template-columns: 90% 1fr 1fr;
	}
	.search-bar {
		width: 100%;
		padding: 10px;
		transition: height 0.3s ease-in-out;
		height: 0;
	}

	.search-container.open .search-bar {
		height: 50px; /* Adjust the height as needed */
	}
</style>
