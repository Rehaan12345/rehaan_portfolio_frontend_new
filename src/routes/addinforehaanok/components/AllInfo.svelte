<script>
    import { onMount } from "svelte";
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Label, Select, Spinner, Button, Modal, Input } from "flowbite-svelte";
    import { getDocuments, getAllColls, addDocument, deleteDoc } from "$lib/model";
    import { writable } from "svelte/store";
    import AddInfo from "./AddInfo.svelte";

    let ready = writable(false);
    let showEditModal = writable(false);
    let confirm = writable(false);

    let allColls = [];
    let allDocs = [];
    let useColl = "Skills";
    let useCollInd = -1;
    let currEdit;
    let dataCount = 0;
    let moreData = [];
    
    const findDoc = (coll) => {
        console.log(allColls);
        const ind = allColls.findIndex(item => item.value === coll);
        console.log(ind);
        return allDocs[ind];
    }

    const handleEdit = async (data) => {
        const res = await addDocument(data);
        console.log(res);
    }

    onMount(async () => {
        ready.set(false);
        allColls = await getAllColls();
        for (let i = 0; i < allColls.length; i++) {
            const curr = allColls[i].value;
            const currDocs = await getDocuments(curr);
            allDocs.push(currDocs);
        }
        ready.set(true);
        console.log(allDocs[0][0]);
        console.log(findDoc("Skills"));
    });
</script>

<style>
    .tablewrapper {
        padding: 1rem;
        border-radius: 10px;
        display: flex;
        flex-wrap: wrap;
    }
</style>

<Modal class="min-w-full" bind:open={$showEditModal} size="lg">
    Edit {currEdit.title}
    {#each Object.entries(currEdit) as [key, value]}
        {#if key != "id"}
            <Label>{key}</Label>
            <input id="{currEdit.id}-{key}" value={value}/>
        {/if}
    {/each}
    {#each Array.from({ length: dataCount }) as _, i}
            <div class="sm:col-span-2">
                <Label for="data-label-{i+1}" class="mb-2">Data Label {i+1}</Label>
                <Input type="text" id="data-label-{i+1}" placeholder="data label {i+1}" required/>
                <Label for="data-input-{i+1}" class="mb-2">Data Input {i+1}</Label>
                <Input type="text" id="data-input-{i+1}" placeholder="data input {i+1}" required/>
                <button class="plusminus" type="button" on:click={() => {
                    const tempLabel = document.getElementById(`data-label-${i+1}`).value;
                    const tempInput = document.getElementById(`data-input-${i+1}`).value;
                    let tempData = {};
                    tempData[tempLabel] = tempInput;
                    moreData.push(tempData);
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
    <button type="submit" style="cursor:pointer;" on:click={async () => {
        let data = {};
        for (let i = 0; i < Object.keys(currEdit).length; i++) {
            const curr = Object.keys(currEdit)[i];
            if (curr != "id") {
                const changed = document.getElementById(currEdit.id + "-" + curr).value;
                data[curr] = changed;
            }
        }
        data["edit"] = true;
        data["id"] = currEdit.id;
        data["collection"] = useColl;
        for (let i = 0; i < moreData.length; i++) {
            const curr = moreData[i];
            data[Object.keys(curr)[0]] = curr[Object.keys(curr)[0]];
        }
        await handleEdit(data);
    }}>Edit</button>
    <br>
    <button style="cursor:pointer;" on:click={() => {confirm = writable(true)}}>Delete doc</button>
    <br>
    {#if $confirm}
        <button style="cursor:pointer;" on:click={async () => {
            const toSend = {
                collection: useColl,
                deleteId: currEdit.id
            }
            await deleteDoc(toSend);
        }}>Confirm Delete</button>
    {/if}
</Modal>

{#if $ready}

    <Label>
        <Select class="mt-2" items={allColls} bind:value={useColl} />
    </Label>

    <div class="tablewrapper">
        <Table>
            <TableHead>
                <TableHeadCell>Edit</TableHeadCell>
                {#each Object.keys(findDoc(useColl)[0]) as k}
                    {#if k != "id"}
                        <TableHeadCell>{k}</TableHeadCell>
                    {/if}
                {/each}
            </TableHead>
            <TableBody>

                {#each findDoc(useColl) as d}
                    <TableBodyRow>
                        <TableBodyCell>
                            <button style="cursor:pointer;" color="green" on:click={() => {showEditModal.set(true); currEdit = d;}}>Edit</button>
                        </TableBodyCell>
                        {#each Object.entries(d) as [key, value]}
                            {#if key != "id"}
                                <TableBodyCell>{value}</TableBodyCell>
                            {/if}
                        {/each}
                    </TableBodyRow>
                {/each}
                
            </TableBody>
        </Table>
    </div>

{:else}

    Loading <Spinner color="green" size={4}/>

{/if}