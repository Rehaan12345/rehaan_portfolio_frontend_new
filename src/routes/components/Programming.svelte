<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { Card } from "flowbite-svelte"
    import "@selemondev/svelte-marquee/dist/style.css";
    import { Marquee } from "@selemondev/svelte-marquee";
    import { getDocuments } from "$lib/model";
    import { writable } from "svelte/store";

	let ready = writable(false);

	let pg = [];

	onMount(async () => {
		ready.set(false);
		pg = await getDocuments("Programming");
		ready.set(true);
	})
</script>

<style>
    .card-wrapper {
        height: 10%;
        width: 10%;
        border-radius: 50%;
    }

	.card-contents {
		padding: 1rem;
		background-color: rgb(193, 193, 193);
        display: grid;
        padding-right: 10rem;
	}

    .img-wrapper img {
        width: 150px;
        height: 150px;
        object-fit: contain;  /* ensures full image fits inside */
        margin-bottom: 1rem;
    }

    .name {
        font-weight:600;
    }

    .proff {
        margin-top: .5rem;
        font-style: italic;
    }

    .p-proff {
        font-style: normal;
        font-size: larger;
    }
</style>

{#if $ready}
   
   <Marquee class="py-4 gap-[.5rem] [--duration:1s] [--gap:.5rem]" pauseOnHover={false} fade={true}>
		{#each pg as p}
            <div class="card-wrapper">
                <div class="img-wrapper">
                    <img src={p.img} alt={p.name}>
                </div>
                <Card class="rounded-lg overflow-hidden">
                    <div class="card-contents">
                        <h5 class="name mb-2 text-2xl font-bold tracking-tight text-gray-900">{p.name}</h5>
                        <div class="proff leading-tight font-normal text-gray-800">
                            Proficiency: 
                            <p class="p-proff">{p.Proficiency}</p>
                        </div>
                    </div>
                </Card>
            </div>
		{/each}
	</Marquee>

{/if}