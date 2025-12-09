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
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
	}

	.text-wrapper {
		padding: 2rem 3rem;
		margin-bottom: 3rem;
		backdrop-filter: blur(20px);
		background: rgba(30, 41, 59, 0.4);
		border: 1px solid rgba(148, 163, 184, 0.2);
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.text-wrapper p {
		font-size: 1.1rem;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.9);
	}

	.text-wrapper a {
		color: rgba(255, 255, 255, 0.9);
		text-decoration: underline;
		transition: color 0.3s ease;
	}

	.text-wrapper a:hover {
		color: white;
	}

	.video-wrapper {
		padding: 2rem 3rem;
		display: flex;
		flex-direction: column;
		gap: 4rem;
	}

	.video {
		backdrop-filter: blur(10px);
		background: rgba(0, 0, 0, 0.3);
		border-radius: 16px;
		padding: 1.5rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		transition: all 0.3s ease;
	}

	.video:hover {
		transform: translateY(-5px);
		box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
	}

	.video-text {
		margin-bottom: 1rem;
	}

	@media (max-width: 1200px) {
		.video-wrapper {
			padding: 2rem;
			gap: 3rem;
		}
		.text-wrapper {
			padding: 1.5rem 2rem;
		}
	}

	@media (max-width: 900px) {
		.video-wrapper {
			padding: 1.5rem;
			gap: 2rem;
		}
		.text-wrapper {
			padding: 1.5rem;
		}
		.title-text {
			font-size: 2rem;
		}
	}

	@media (max-width: 600px) {
		.video-wrapper {
			padding: 1rem;
			gap: 1.5rem;
		}
		.text-wrapper {
			padding: 1rem;
		}
		.title-text {
			font-size: 1.75rem;
		}
	}
</style>

{#if $ready}

	<Section name="team">
		<div class="text-wrapper">
			<h2 class="title-text">Film Work</h2>
			<p>
				I love to film, combining aerial and handheld camera work to tell a visual story. My work ranges from personal projects, like filming my high school <a href="#crew">crew</a> team, to filming documentaries around community-centered <a href="#cyc">mural projects</a>, to helping local nonprofits <a href="#starlight">fundraise</a>.
				<br><br>
				More work can also be found on my company page <a href="https://www.volostudios.media" target="_blank">VoloStudios</a>, where I film commercially for industries ranging from construction to weddings.
			</p>
		</div>

		<div class="video-wrapper">
			<div class="video" id="cyc">
				<div class="video-text">
					<p class="text-xl title-text">Cambridge Community Mural</p>
				</div>
				<Video src="https://firebasestorage.googleapis.com/v0/b/rehaan-portfolio.firebasestorage.app/o/CYCDocDraft7-Credits.mp4?alt=media&token=c40d3e7e-9a87-4c2a-bbd5-8d868133f0a7" controls class="rounded-lg"/>
			</div>
			<div class="video" id="starlight">
				<div class="video-text">
					<p class="text-xl title-text">Starlight Square Fundraising Campaign</p>
				</div>
				<Video src="https://firebasestorage.googleapis.com/v0/b/rehaan-portfolio.firebasestorage.app/o/Take11.mp4?alt=media&token=48cb245f-aba9-4540-9ca2-dbe5dad6f308" controls class="rounded-lg"/>
			</div>
			<div class="video" id="crew">
				<div class="video-text">
					<p class="text-xl title-text">High School Crew Practice</p>
				</div>
				<Video src="https://firebasestorage.googleapis.com/v0/b/rehaan-portfolio.firebasestorage.app/o/CrewVid.mp4?alt=media&token=0cc54fcf-bb3c-4404-8d85-1ca168dbcec4" controls class="rounded-lg"/>
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