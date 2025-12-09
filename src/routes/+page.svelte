<script>
	import { onMount } from "svelte";
    import Main from "./components/Main.svelte";
	import { Spinner } from "flowbite-svelte";

	// onMount(() => {
	// 	FlexMasonry.init('.grid');
	// })
</script>

<style>
	main {
		background: linear-gradient(to bottom, #0f172a 0%, #1e293b 50%, #334155 100%);
		min-height: 100vh;
		position: relative;
		overflow-x: hidden;
	}

	* {
		scroll-behavior: smooth;
	}

	html {
		scroll-behavior: smooth;
	}
</style>

<!-- <div class="grid">
    <div><img src="https://picsum.photos/id/237/200/300" alt=""></div>
    <div><img src="https://picsum.photos/seed/picsum/200/300" alt=""></div>
    <div><img src="https://picsum.photos/200/300?grayscale" alt=""></div>
    <div><img src="https://picsum.photos/200/300/?blur" alt=""></div>
    <div><img src="https://picsum.photos/id/870/200/300?grayscale&blur=2" alt=""></div>
</div> -->

<main>
    <Main></Main>
</main>