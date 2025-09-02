<script lang="ts">
	import { Section, Contact } from 'flowbite-svelte-blocks';
	import { Label, Input, Textarea } from 'flowbite-svelte';
	import { Page404 } from 'flowbite-svelte-blocks';
	import { Button } from 'flowbite-svelte';
</script>

<!-- <Section name="contact">
	<Contact>
		{#snippet h2()}Contact Me{/snippet}
		<p style="color: white;display:flex; justify-content: center; align-items: center;">
			Email: rehaananjaria@gmail.com
		</p>
	</Contact>
</Section> -->

<style>
	.title-text {
		font-size: xx-large;
		display: flex;
		justify-content: center;
		align-items: center;
		font-weight: bold;
	}
</style>

<Section name="page404">
	<div class="title-text">
		Contact Me
	</div>
	<p>
		<center>
			Send me an email at
			<button>
				<a href="mailto:rehaananjaria@gmail.com"><u>rehaananjaria@gmail.com</u></a>
			</button>
		</center>
	</p>
</Section>