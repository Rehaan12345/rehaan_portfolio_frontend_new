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

{#if $ready}

    <Schedule scheduleName="Rehaan Anjaria">
        {#each info as item}
            <ScheduleItem {item} />
        {/each}
    </Schedule>

{/if}