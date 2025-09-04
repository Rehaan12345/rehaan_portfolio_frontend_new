<script lang="js">
    //@ts-nocheck
    import { onMount } from "svelte";
    import { getAllColls } from "$lib/model"
    import { Hamburger } from 'svelte-hamburgers';
    import { fly } from "svelte/transition"

    let open = $state(false);

    // svelte-ignore non_reactive_update
    let allColls = [];
    let collections = [];

    function fixColls() {
        const sortedList = collections.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
        for (let i = 0; i < collections.length; i++){
            const temp = collections[i].charAt(0).toUpperCase() + collections[i].slice(1);
            collections[i] = temp;
        }
        collections.splice(collections.indexOf("ShortBio"), 1);
    }

    onMount(async() => {
        allColls = await getAllColls();
        for (let i = 0; i < allColls.length; i++) collections.push(allColls[i].value);
        fixColls();
        open = window.innerWidth >= 768;
    })
</script>

<style>
    .nav-wrapper {
        position: fixed;
        z-index: 9999;
    }

    .ham-wrapper {
        z-index: 10;
    }

    .nav-els {
        border-left: .5px solid rgb(191, 191, 191);
        /* border-bottom: .5px solid rgb(191, 191, 191); */
        border-radius: 10px;
        padding: 1rem;
        margin-left: 1.5rem;
    }

    .nav-el {
        padding-bottom: .5rem;
        font-size: larger;
        color: white;
        font-family: Georgia, 'Times New Roman', Times, serif;
        cursor: pointer;
    }

    .nav-el:hover {
        border-bottom: 1px solid white;
        transition: all 0.3s ease;    
    }
        
</style>

<div class="nav-wrapper">
    <div class="ham-wrapper">
        <Hamburger type="slider" --color="white" 
            bind:open
            title="Toggle nav links"
            ariaControls="nav"/>
    </div>
    {#if open}
        <div class="nav-els" transition:fly={{ y: -15 }}>
            {#each collections as c}
                {#if c != "OtherProjects" && c != "Skills"}
                <div class="nav-el">
                    <a href="#{c}">{c}</a>
                </div>
                {/if}
            {/each}
            <div class="nav-el">
                <a href="#Film">Film Work</a>
            </div>
            <div class="nav-el">
                <a href="#Contact">Contact</a>
            </div>
        </div>
    {/if}
</div>