<script>
	//@ts-nocheck
	import { onMount } from "svelte";
	import { Section, ArticleAuthor, ArticleBody, ArticleHead, ArticleWrapper, BlogHead, BlogBodyWrapper } from 'flowbite-svelte-blocks';
	import { Button, Popover, Modal, Card } from "flowbite-svelte";
	import { VideoCameraSolid, ArrowRightOutline, NewspaperSolid, ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { writable } from "svelte/store";
	import { getDocuments } from "$lib/model";

	let ready = writable(false);
	let showBigImg = writable(false);
	let bigImgUrl = writable("");

	let projects = [];

	let currHover;

	let windowWidth;
	let columns;

	if (typeof window !== 'undefined') {
		windowWidth = Math.min(screen.width, window.innerWidth);
		columns = Math.max(1, Math.floor((windowWidth - 100) / 384));

		window.addEventListener('resize', () => {
			windowWidth = Math.min(screen.width, window.innerWidth);
			columns = Math.max(1, Math.floor((windowWidth - 100) / 384));
		});
	}

	onMount(async() => {
		ready.set(false);
		projects = await getDocuments("Projects");
		currHover = projects[0];
		ready.set(true);
	});
</script>

<!-- {#if $ready} -->

<style>
	.img-wrapper {
		display: flex;
		flex-direction: row;
		min-width: 20rem;
		min-height: 20rem;
		max-width: 40rem;
		max-width: 40rem;
		gap: 2rem;
	}
/* 
	.about {
		background-color: green;
	} */

	.title {
		color: black;
	}

	.title:hover {
		border-bottom: 2px solid maroon;
	}

	.title-text {
		color: white;
		font-size: xx-large;
	}
/* 
	.hover-text {
		color: white;
		padding-bottom: 2rem;
	}

	.art-wrap {
		transition: all 0.5s ease-in-out;
	}

	.art-wrap:hover {
		transform: scale(1.02);
		transition: all ease-in-out .3s;
    	box-shadow: 0 0 8px 4px #cffaf6, 0 0 32px 8px #cffaf6;
		cursor: pointer;
		border-radius: 10px;
	} */

	.outer-container {
		display: flex;
		justify-content: center;
	}

	.wholeclubwrapper {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		/* align-items: center;
            justify-content: center; */
		width: fit-content;
		margin-bottom: -100px;
	}

	.card-container {
		padding: 3rem;
		overflow: hidden;
		width: fit-content;
		gap: 2rem;
		align-self: center;
		display: grid;
		grid-template-columns: repeat(2, minmax(100px, 1fr));
	}

	.masonry-column {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: center;
		width: 1fr;
	}

	.title-txt-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.card-contents {
		padding: 1rem;
		background-color: #edcdcd;
		/* background-color: linear-gradient(to bottom, #000000 0%, #EB5757 100%); */
	}

	.card {
		transition: all 0.3s ease-in-out;
	}

	.card:hover {
		transform: scale(1.02);
		transition: all ease-in-out 0.2s;
		box-shadow: inset;
	}

	.github-links-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem;
	}

	.gh-link {
		cursor: auto;
		font-size: medium;
		font-style: italic;
		color: maroon;
		z-index: 200;
	}

	.gh-link:hover {
		border-bottom: 1px solid maroon;
	}

	@media (max-width: 1200px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
	}

	@media (max-width: 800px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		}
	}

	@media (max-width: 500px) {
		.wholeclubwrapper {
			padding: 1rem;
		}

		.card-container {
			padding: 0 1rem;
		}
	}
</style>

{#if $ready}

	<Modal class="min-w-full" open={$showBigImg} on:close={() => {showBigImg.set(false); }} size="xl">
		<button type="button" on:click={() => {showBigImg.set(false);}} style="padding:0; border:none; background:none;">
			<img style="border-radius:5px" src={$bigImgUrl} alt="">
		</button>
	</Modal>

	<Popover triggeredBy="#about" title={currHover.title}>
		<p><i>(slide right to view more and click to expand!)</i></p>

		<div class="img-wrapper">
			{#each currHover.images as i}
				<!-- svelte-ignore a11y_click_events_have_key_events -->
				<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
				<img style="cursor:pointer;" on:click={() => {bigImgUrl.set(i); showBigImg.set(true);}} alt="" src={i}>
			{/each}
		</div>
		
	</Popover>

	<Section name="blog">
		<h2 class="title-text">Projects</h2>
		<p style="color: white;"><i>(Hover over the title to view more pictures from each project)</i></p>
		<div class="outer-container">
		<div class="wholeclubwrapper">
			<div class="card-container">
				{#each Array(columns) as _, colIndex}
					{#if projects .filter((_, i) => i % columns === colIndex).length > 0}
						<div class="masonry-column" style="flex: 1;">
							{#each projects .filter((_, i) => i % columns === colIndex) as p}
								<!-- svelte-ignore a11y_click_events_have_key_events -->
								<div class="card" role="button" tabindex="0" on:click={() => {if (p.website.length > 1) window.open(p.website, "_blank")}}>
									<Card size="xl" img={p.images[0]} class="rounded-lg overflow-hidden">
										<div class="card-contents" role="button" tabindex="0">
											<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">
												<div class="title-txt-wrapper">
													<!-- svelte-ignore a11y_invalid_attribute -->
													<a on:mouseover={() => {currHover = p}} on:focus={() => {currHover = p}} class="title" id="about" href="#">
														{p.title}
													</a><ArrowUpRightFromSquareOutline class="shrink-0 h-6 w-6" />
												</div>
											</h5>
											<p class="about mb-5 font-light text-gray-800">{p.about}</p>
											<div class="github-links-wrapper">
												<div class="gh-link">
													{#if p["github-link-frontend"].length > 2}
														<a href={p["github-link-frontend"]} on:click|stopPropagation target="_blank">View Frontend </a>
													{/if}
												</div>
												<div class="gh-link">
													{#if p["github-link-backend"].length > 2}
														<a href={p["github-link-backend"]} on:click|stopPropagation target="_blank">View Backend</a>
													{/if}
												</div>
											</div>
										</div>
									</Card>
								</div>
							{/each}
						</div>
					{/if}
				{/each}
			</div>
		</div>
	</div>
	</Section>

	
	

	

{/if}