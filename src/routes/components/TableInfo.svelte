<script>
    import { Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, Checkbox } from "flowbite-svelte";
</script>

<Table color="gray" hoverable={true}>
    <TableHead>
        <TableHeadCell class="p-4!">
        <Checkbox />
        </TableHeadCell>
        <TableHeadCell>Product name</TableHeadCell>
        <TableHeadCell>Age</TableHeadCell>
        <TableHeadCell>Skills</TableHeadCell>
        <TableHeadCell>Projects</TableHeadCell>
        <TableHeadCell>
        <span class="sr-only">Edit</span>
        </TableHeadCell>
    </TableHead>
    <TableBody>
        <TableBodyRow>
        <TableBodyCell class="p-4!">
            <Checkbox />
        </TableBodyCell>
        <TableBodyCell>Rehaan Anjaria</TableBodyCell>
        <TableBodyCell>18</TableBodyCell>
        <TableBodyCell>Problem Solving | Civic Tech</TableBodyCell>
        <TableBodyCell>A lot</TableBodyCell>
        </TableBodyRow>
    </TableBody>
</Table>