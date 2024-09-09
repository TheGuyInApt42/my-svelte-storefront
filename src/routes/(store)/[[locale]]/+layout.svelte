<script lang="ts">
	import type { LayoutServerData } from './$types'
	import HeadTemplate from '$lib/components/HeadTemplate.svelte'
	import CountrySelector from '$lib/components/CountrySelector.svelte'
	import Link from '$root/lib/components/Link.svelte'
	import SearchBar from '$root/lib/components/search-bar/SearchBar.svelte'
	import Icons from '$root/lib/components/Icons.svelte'
	import NewsletterSignup from '$root/lib/components/NewsletterSignup.svelte'
	import '$root/app.css'

	export let data: LayoutServerData

	$: ({ shop, cart, headerMenu, footerMenu } = data.layout)

	let searchOpen = false

	function toggleSearch() {
		searchOpen = !searchOpen
	}

	function closeSearch() {
		searchOpen = false
	}
</script>

<HeadTemplate />

<header
	class="flex flex-col justify-between p-1 bg-gray-100 lg:flex-row lg:items-center lg:gap-5"
>
	<div class="flex flex-col lg:flex-row lg:items-center lg:gap-5">
		<a href="/">
			{shop?.name ?? 'Shopify Store'}
		</a>
		<nav class="flex items-center gap-2">
			{#each headerMenu.items as item}
				<a href={item.url}>{item.title}</a>
			{/each}
		</nav>
	</div>
	<div class="flex items-center gap-2">
		<!-- <Link href="/search">Search</Link> -->
		<!-- Search Icon -->
		<button on:click={toggleSearch}>
			<Icons type="search" />
		</button>
		{#if searchOpen}
			<SearchBar isOpen={searchOpen} onClose={closeSearch} />
		{/if}

		<Link href="/account">Account</Link>
		<Link href="/cart">Cart - {cart?.totalQuantity ?? 0}</Link>
	</div>
</header>

<main class="flex-1">
	<NewsletterSignup />
	<slot />
</main>

<footer class="flex flex-col gap-5 p-4 bg-gray-100">
	<nav class="flex items-center gap-2">
		{#each footerMenu.items as item}
			<a href={item.url}>{item.title}</a>
		{/each}
	</nav>
	<!-- <CountrySelector /> -->
</footer>

<style lang="postcss">
	:global(body) {
		@apply flex flex-col min-h-screen;
	}
</style>
