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
        top: 1rem;
        left: 1rem;
    }

    .ham-wrapper {
        z-index: 10;
        margin-bottom: 0.5rem;
    }

    .nav-els {
        backdrop-filter: blur(20px);
        background: rgba(30, 41, 59, 0.6);
        border: 1px solid rgba(148, 163, 184, 0.2);
        border-radius: 12px;
        padding: 1.5rem;
        margin-top: 0.5rem;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        min-width: 200px;
    }

    .nav-el {
        padding: 0.75rem 0;
        font-size: 1rem;
        color: white;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-bottom: 2px solid transparent;
    }

    .nav-el a {
        color: inherit;
        text-decoration: none;
        display: block;
        width: 100%;
    }

    .nav-el:hover {
        transform: translateX(4px);
        border-bottom-color: rgba(59, 130, 246, 0.6);
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
        <div class="nav-els" transition:fly={{ y: -15, duration: 300 }}>
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