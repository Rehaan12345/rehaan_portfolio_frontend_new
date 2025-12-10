<script>
// @ts-nocheck

    import { onMount } from 'svelte';
    import { Section, Schedule, ScheduleItem } from 'flowbite-svelte-blocks';
	import { getDocuments } from "$lib/model";
    import { writable } from "svelte/store"

    let ready = writable(false);

	let info;

    function formatSchedule(dict) {
        return Object.entries(dict).map(([key, value]) => ({
            time: key,
            href: '/',
            title: value
        }));
    }

	onMount(async () => {
        ready.set(false);
		info = await getDocuments("ShortBio");
        info = info[0];
        delete info.id;
        console.log(info);
        info = formatSchedule(info);
        console.log(info);
        ready.set(true);
	})

</script>

<style>
	/* Target the Schedule component's name with comprehensive selectors */
	:global(.schedule-name),
	:global([class*="schedule"] h2),
	:global([class*="schedule"] h3),
	:global([class*="Schedule"] h2),
	:global([class*="Schedule"] h3),
	:global(section[class*="schedule"] h2),
	:global(section[class*="Schedule"] h2),
	:global(div[class*="schedule"] h2),
	:global(div[class*="Schedule"] h2),
	:global([class*="schedule"] h1),
	:global([class*="Schedule"] h1),
	:global([class*="schedule"] [class*="title"]),
	:global([class*="Schedule"] [class*="title"]) {
		background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%) !important;
		-webkit-background-clip: text !important;
		-webkit-text-fill-color: transparent !important;
		background-clip: text !important;
	}
</style>

{#if $ready}

    <Schedule scheduleName="Rehaan Anjaria">
        {#each info as item}
            <ScheduleItem {item} />
        {/each}
    </Schedule>

{/if}