<script lang="js">
// @ts-nocheck

    import { onMount } from 'svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import { Label, Input, Button, Select, Textarea, Spinner } from 'flowbite-svelte';
    import { writable } from "svelte/store";
    import { addDocument, getDocuments, getAllColls } from "$lib/model"
    import AllInfo from "./components/AllInfo.svelte";
    import AddInfo from "./components/AddInfo.svelte";

    let cp = import.meta.env.VITE_RA;

    let showPage = writable(false);
    let ready = writable(false);
    let saveLoading = writable(false);
    let loading = writable(false);
    let successMessage = writable("");

    let allColls = [];
    let useColl = "";

    let moreData = [];

    let currPass = "";

    let dataCount = 0;

    const handlePassSubmit = () => {
        if (currPass == cp) showPage.set(true);
    }

	const handleSubmit = async () => {
        loading.set(true);
        const data = {
            collection: useColl,
            moreData: moreData
        };
        const res = await addDocument(data);
        console.log(res);
        loading.set(false);
        moreData = [];
        useColl = "";
        dataCount = 0;
	};

    onMount(async () => {
        allColls = await getAllColls();
        console.log(allColls);
        for (let i = 0; i < allColls.length; i++) {
            console.log(await getDocuments(allColls[i].value));
        }
    })
    
</script>

<style>
    * {
        background-color: rgb(173, 225, 236);
        color: black;
    }

    /* .formwrapper {
        margin: 5rem;
    } */
</style>

<a href="/">Go Home</a>

{#if $showPage}
        
    <AddInfo></AddInfo>

    <AllInfo></AllInfo>
        
{:else}

    <form on:submit={handlePassSubmit}>
        <label for="enter-the-site-code">Password</label>
        <input style="border: 1px solid red;" type="password" name="enter-the-site-code" id="enter-the-site-code" bind:value={currPass}>
        <input style="border: 1px solid black; cursor:pointer; padding: .5rem;" type="submit">
    </form>

{/if}