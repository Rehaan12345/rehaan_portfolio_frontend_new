<script lang="js">
	//@ts-nocheck
	import {onMount} from "svelte";
	import { Section, HeroHeader, FeatureDefault, FeatureItem } from 'flowbite-svelte-blocks';
	import { ChartPieSolid, LandmarkSolid, BriefcaseSolid, DollarOutline, RocketSolid, CogOutline } from 'flowbite-svelte-icons';
	import { getDocuments } from "$lib/model";
	import { writable } from "svelte/store";
    // import "@selemondev/svelte-marquee/dist/style.css";
    import { Marquee } from "@selemondev/svelte-marquee";
	import { Card } from "flowbite-svelte";
	import { AccordionItem, Accordion } from "flowbite-svelte";

	let ready = writable(false);

	let skills = [];

	onMount(async () => {
		ready.set(false);
		skills = await getDocuments("Skills");
		ready.set(true);
	})
</script>

<style>
	.title-text {
		margin-left: 5%;
		color: white;
		font-size: xx-large;
	}

	.card-contents {
		padding: 2rem;
		/* background: linear-gradient(to right, #0F2027, #203A43, ); */
		background-color: #edcdcd;
		height: 100%;
		/* background-color: aquamarine; */
		/* border-radius: 50px; */
	}

	.accordian-wrapper {
		padding: 3rem;
	}
</style>

{#if $ready}

	<h2 class="title-text">Skills</h2>

	<!-- <Marquee class="py-4 gap-[3rem] [--duration:1s] [--gap:3rem]" innerClassName="gap-[3rem]" pauseOnHover={true} fade={true}>
		{#each skills as s}
			<Card class="rounded-lg overflow-hidden">
				<div class="card-contents">
					<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900">{s.title}</h5>
					<p class="leading-tight font-normal text-gray-800">{s.info}</p>
				</div>
			</Card>
		{/each}
	</Marquee> -->

	<div class="accordian-wrapper">
		<Accordion flush>
			{#each skills as s}
				<AccordionItem open>
					{#snippet header()}{s.title}{/snippet}
					<p class="mb-2 text-gray-500 dark:text-gray-400">{s.info}</p>
				</AccordionItem>
			{/each}
		</Accordion>
	</div>

{/if}
