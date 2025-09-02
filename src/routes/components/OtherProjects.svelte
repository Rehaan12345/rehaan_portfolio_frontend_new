<script lang="js">
	//@ts-nocheck
	import { onMount } from "svelte";
	import { Section, TeamWrapper, TeamHeader, TeamBody, TeamItem } from 'flowbite-svelte-blocks';
	import { Video } from "flowbite-svelte";
	import { writable } from "svelte/store";
	import { getDocuments } from "$lib/model";

	let ready = writable(false);
	let otherProjectsTemp = [];
	let otherProjects = [];

	onMount(async() => {
		ready.set(false);
		otherProjectsTemp = await getDocuments("OtherProjects");
		for (let i = 0; i < otherProjectsTemp.length; i++) {
			const curr = otherProjectsTemp[i];
			const temp = {
				href: curr.link,
				target: "_blank",
				src: curr.src,
				alt: curr.title,
				name: curr.title,
				jobTitle: "",
				description: curr.about
			}
			otherProjects.push(temp);
		}
		ready.set(true);
	});
</script>

<style>
	.title-text {
		color: white;
		font-size: xx-large;
	}

	.video-wrapper {
		margin: 10rem;
	}

	.video {
		margin-bottom: 3rem;
	}

	@media (max-width: 1200px) {
		.video-wrapper {
			margin: 5rem;
		}
		.video {
			margin-bottom: 2rem;
		}
	}

	@media (max-width: 900px) {
		.video-wrapper {
			margin: 2rem;
		}
		.video {
			margin-bottom: 1.5rem;
		}
	}

	@media (max-width: 600px) {
		.video-wrapper {
			margin: 1rem;
		}
		.video {
			margin-bottom: 1rem;
		}
	}
</style>

{#if $ready}

	<Section name="team">
		<div class="text-wrapper" style="padding-left: 3rem; padding-right:3rem;">
			<h2 class="title-text">Film Work</h2>
			<p style="font-size:larger;">
				<i>
					I love to film, combining aerial and handheld camera work to tell a visual story. My work ranges from personal projects, like filming my high school <a href="#crew"><u>crew</u></a> team, to filming documentaries around community-centered <a href="#cyc"><u>mural projects</u></a>, to helping local nonprofits <a href="#starlight"><u>fundraise</u></a>.
					<br>
					More work can also be found on my company page <a href="https://www.volostudios.media" target="_blank"><u>VoloStudios</u></a>, where I film commercially for industries ranging from construction to weddings.
				</i>
			</p>
		</div>

		<div class="video-wrapper">
			<div class="video-text">
				<p class="text-xl title-text dark:text-white">Cambridge Community Mural</p>
			</div>
			<div class="video" id="cyc">
				<Video src="https://firebasestorage.googleapis.com/v0/b/rehaan-portfolio.firebasestorage.app/o/CYCDocDraft7-Credits.mp4?alt=media&token=c40d3e7e-9a87-4c2a-bbd5-8d868133f0a7" controls/>
			</div>
			<div class="video-text">
				<p class="text-xl title-text dark:text-white">Starlight Square Fundraising Campaign</p>
			</div>
			<div class="video" id="starlight">
				<Video src="https://firebasestorage.googleapis.com/v0/b/rehaan-portfolio.firebasestorage.app/o/Take11.mp4?alt=media&token=48cb245f-aba9-4540-9ca2-dbe5dad6f308" controls/>
			</div>
			<div class="video-text">
				<p class="text-xl title-text dark:text-white">High School Crew Practice</p>
			</div>
			<div class="video" id="crew">
				<Video src="https://firebasestorage.googleapis.com/v0/b/rehaan-portfolio.firebasestorage.app/o/CrewVid.mp4?alt=media&token=0cc54fcf-bb3c-4404-8d85-1ca168dbcec4" controls/>
			</div>
		</div>

		<!-- <TeamWrapper>
			<TeamBody>
				{#each otherProjects as { href, src, alt, name, jobTitle, description }}
					<TeamItem {href} {src} {alt} {name} {jobTitle}>
						<p class="mt-3 mb-4 font-light text-gray-400">
							{description}
						</p>
					</TeamItem>
				{/each}
			</TeamBody>
		</TeamWrapper> -->
	</Section>

{/if}