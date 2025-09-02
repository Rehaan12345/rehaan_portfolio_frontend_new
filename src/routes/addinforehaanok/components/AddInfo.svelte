<script lang="js">
// @ts-nocheck

    import { onMount } from 'svelte';
	import { Section } from 'flowbite-svelte-blocks';
	import { Label, Input, Button, Select, Textarea, Spinner } from 'flowbite-svelte';
    import { writable } from "svelte/store";
    import { addDocument, getDocuments, getAllColls } from "$lib/model"

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

    .plusminus {
        border: 1px solid black;
        padding: 1rem;
        cursor: pointer;
    }

    /* .formwrapper {
        margin: 5rem;
    } */
</style>

<!-- <Modal title="" open={$showDeleteModal} on:close={() => {showDeleteModal.set(false);}} autoclose size="sm" class="w-full">
        <svg class="mx-auto mb-3.5 h-11 w-11 text-gray-400 dark:text-gray-500" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"
            ><path
                fill-rule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clip-rule="evenodd"
            /></svg
        >
        <p class="mb-4 text-center text-gray-500 dark:text-gray-300">Are you sure you want to delete this item?</p>
        <div class="flex items-center justify-center space-x-4">
            <Button color="light" onclick={() => {showDeleteModal.set(false);}}>No, cancel</Button>
            <Button color="red" onclick={handleDelete}>Yes, I'm sure</Button>
        </div>
    </Modal> -->


    <h2 class="mb-4 text-xl font-bold text-gray-900 dark:text-white">
        Add Info
        <br>
    </h2>

    <form on:submit={() => {handleSubmit()}}>
        <Label>
            Category
            <Select class="mt-2" items={allColls} bind:value={useColl} />
        </Label>

        <Label>New Category</Label>
        <Input bind:value={useColl} />

        {#each Array.from({ length: dataCount }) as _, i}
            <div class="sm:col-span-2">
                <Label for="data-label-{i+1}" class="mb-2">Data Label {i+1}</Label>
                <Input type="text" id="data-label-{i+1}" placeholder="data label {i+1}" required/>
                <Label for="data-input-{i+1}" class="mb-2">Data Input {i+1}</Label>
                <Input type="text" id="data-input-{i+1}" placeholder="data input {i+1}" required/>
                <button class="plusminus" type="button" on:click={() => {
                    saveLoading.set(true);
                    const tempLabel = document.getElementById(`data-label-${i+1}`).value;
                    const tempInput = document.getElementById(`data-input-${i+1}`).value;
                    let tempData = {};
                    tempData[tempLabel] = tempInput;
                    moreData.push(tempData);
                    saveLoading.set(false);
                }}>
                    Save
                </button>
            </div>
        {/each}
        <br>

        <div class="sm:col-span-2">
            Add data fields
            <button class="plusminus" color="blue" outline size="xs" on:click={() => {dataCount++;}}>+</button>
            <button class="plusminus" color="blue" outline size="xs" on:click={() => {if (dataCount>0) dataCount--;}}>-</button>
        </div>

        <br>
        <div class="sm:col-span-2">
            {#if $loading}
                <Button type="submit" class="w-32" disabled>
                    <Spinner color="primary" size={6}/>
                </Button>
            {:else}
                <Button outline color="dark" size="sm" type="submit" class="w-32">
                    Add
                </Button>
            {/if}
        </div>
    </form>
    {#if $successMessage.length > 1}
        {#if $successMessage.length > 1}
            <br>
            <Alert color="green">
                <span class="font-medium">Success:</span>
                {$successMessage}
            </Alert>
        {/if}

        <UploadPhotos {imgFolderId}></UploadPhotos>
    {/if}