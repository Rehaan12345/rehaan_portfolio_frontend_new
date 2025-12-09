<script>
	//@ts-nocheck
	import { onMount } from "svelte";
	import { Section, ArticleAuthor, ArticleBody, ArticleHead, ArticleWrapper, BlogHead, BlogBodyWrapper } from 'flowbite-svelte-blocks';
	import { Button, Popover, Modal, Card } from "flowbite-svelte";
	import { VideoCameraSolid, ArrowRightOutline, NewspaperSolid, ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';
	import { writable } from "svelte/store";
	import { getDocuments } from "$lib/model";

	let ready = writable(false);
	let showBigImg = writable(false);
	let bigImgUrl = writable("");

	let projects = [];
	let expandedProjects = $state(new Set());

	let currHover;

	let windowWidth;
	let columns;

	function getBulletPoints(text) {
		// Split by sentences (periods, exclamation, question marks)
		const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
		// Take first 2-3 sentences, ensuring each is one concise sentence
		const bulletCount = Math.min(3, sentences.length);
		return sentences.slice(0, bulletCount).map(s => {
			let trimmed = s.trim();
			// Condense long sentences to key information (max ~100 chars)
			if (trimmed.length > 100) {
				// Try to find a natural break point before 100 chars
				const breakPoint = Math.min(
					trimmed.indexOf(',', 70) > 0 ? trimmed.indexOf(',', 70) : 100,
					trimmed.indexOf(';', 70) > 0 ? trimmed.indexOf(';', 70) : 100,
					100
				);
				trimmed = trimmed.substring(0, breakPoint).trim();
				// Add ellipsis only if we actually truncated
				if (breakPoint < s.trim().length) {
					trimmed += '...';
				}
			}
			return boldImportantWords(trimmed);
		});
	}

	function boldImportantWords(text) {
		// Common important words/patterns to bold
		const importantPatterns = [
			// Technologies and frameworks
			/\b(React|Vue|Angular|Svelte|Next\.js|Node\.js|Express|Django|Flask|FastAPI|Spring|Laravel|Rails)\b/gi,
			// Languages
			/\b(JavaScript|TypeScript|Python|Java|C\+\+|C#|Go|Rust|PHP|Ruby|Swift|Kotlin)\b/gi,
			// Databases
			/\b(PostgreSQL|MySQL|MongoDB|Redis|Firebase|Supabase|DynamoDB|SQLite)\b/gi,
			// Cloud and services
			/\b(AWS|Azure|GCP|Docker|Kubernetes|CI\/CD|REST|GraphQL|API|APIs)\b/gi,
			// Important features
			/\b(Authentication|Authorization|OAuth|JWT|WebSocket|Real-time|Machine Learning|AI|ML)\b/gi,
			// Action verbs indicating key features
			/\b(Built|Created|Developed|Implemented|Designed|Integrated|Deployed|Optimized|Scaled)\b/gi,
			// Numbers and percentages
			/\b(\d+%|\d+x|\d+\s*(users|requests|queries|items|features))\b/gi,
			// Common important terms
			/\b(Full-stack|Frontend|Backend|Microservices|Serverless|Responsive|Mobile|Web|App)\b/gi,
		];

		let result = text;
		const boldedWords = new Set();

		importantPatterns.forEach(pattern => {
			result = result.replace(pattern, (match) => {
				// Avoid double bolding
				if (!boldedWords.has(match.toLowerCase())) {
					boldedWords.add(match.toLowerCase());
					return `<strong>${match}</strong>`;
				}
				return match;
			});
		});

		return result;
	}

	function toggleExpand(projectId) {
		const newSet = new Set(expandedProjects);
		if (newSet.has(projectId)) {
			newSet.delete(projectId);
		} else {
			newSet.add(projectId);
		}
		expandedProjects = newSet;
	}

	if (typeof window !== 'undefined') {
		windowWidth = Math.min(screen.width, window.innerWidth);
		columns = Math.max(1, Math.floor((windowWidth - 100) / 384));

		window.addEventListener('resize', () => {
			windowWidth = Math.min(screen.width, window.innerWidth);
			columns = Math.max(1, Math.floor((windowWidth - 100) / 384));
		});
	}

	onMount(async() => {
		ready.set(false);
		projects = await getDocuments("Projects");
		currHover = projects[0];
		ready.set(true);
	});
</script>

<!-- {#if $ready} -->

<style>
	.img-wrapper {
		display: flex;
		flex-direction: row;
		gap: 1rem;
		overflow-x: auto;
		padding: 1rem 0;
		scroll-snap-type: x mandatory;
	}

	.img-wrapper img {
		scroll-snap-align: start;
		border-radius: 8px;
		cursor: pointer;
		transition: transform 0.3s ease;
	}

	.img-wrapper img:hover {
		transform: scale(1.05);
	}

	.title {
		color: #1e293b;
		text-decoration: none;
		transition: all 0.3s ease;
	}

	.title:hover {
		color: #3b82f6;
	}

	.title-text {
		color: white;
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 1rem;
		text-align: center;
	}

	.outer-container {
		display: flex;
		justify-content: center;
		padding: 2rem 0;
	}

	.wholeclubwrapper {
		display: flex;
		flex-direction: column;
		gap: 2rem;
		width: 100%;
		max-width: 1400px;
		margin: 0 auto;
		padding: 0 2rem;
	}

	.card-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 2rem;
		width: 100%;
	}

	.masonry-column {
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	.title-txt-wrapper {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}

	.card-contents {
		padding: 1.5rem;
		background: linear-gradient(135deg, rgba(226, 232, 240, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%);
		backdrop-filter: blur(10px);
	}

	.card {
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
		height: 100%;
	}

	.card:hover {
		transform: translateY(-8px) scale(1.02);
		box-shadow: 0 20px 40px rgba(59, 130, 246, 0.25);
	}

	.github-links-wrapper {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 1.5rem;
		padding-top: 1rem;
		flex-wrap: wrap;
	}

	.gh-link {
		cursor: pointer;
		font-size: 0.9rem;
		font-weight: 500;
		color: #475569;
		text-decoration: none;
		transition: all 0.3s ease;
		padding-bottom: 2px;
		border-bottom: 2px solid transparent;
	}

	.gh-link:hover {
		color: #3b82f6;
		border-bottom-color: #3b82f6;
	}

	.subtitle-text {
		color: rgba(255, 255, 255, 0.8);
		text-align: center;
		margin-bottom: 2rem;
		font-style: italic;
	}

	.bullet-points {
		list-style: none;
		padding: 0;
		margin: 0 0 1rem 0;
	}

	.bullet-points li {
		position: relative;
		padding-left: 1.5rem;
		margin-bottom: 0.5rem;
		color: #475569;
		font-size: 0.95rem;
		line-height: 1.6;
	}

	.bullet-points li::before {
		content: "•";
		position: absolute;
		left: 0;
		color: #3b82f6;
		font-weight: bold;
		font-size: 1.2rem;
	}

	.bullet-points li strong {
		color: #1e293b;
		font-weight: 700;
	}

	.full-description {
		color: #475569;
		font-size: 0.95rem;
		line-height: 1.6;
		margin-bottom: 1rem;
	}

	.view-more-btn {
		background: rgba(59, 130, 246, 0.1);
		border: 1px solid rgba(59, 130, 246, 0.3);
		color: #3b82f6;
		padding: 0.5rem 1rem;
		border-radius: 6px;
		font-size: 0.9rem;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.3s ease;
		margin-top: 0.5rem;
	}

	.view-more-btn:hover {
		background: rgba(59, 130, 246, 0.2);
		border-color: rgba(59, 130, 246, 0.5);
		transform: translateY(-1px);
	}

	@media (max-width: 1200px) {
		.card-container {
			grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		}
	}

	@media (max-width: 800px) {
		.card-container {
			grid-template-columns: 1fr;
		}
		.title-text {
			font-size: 2rem;
		}
	}

	@media (max-width: 500px) {
		.wholeclubwrapper {
			padding: 0 1rem;
		}
		.title-text {
			font-size: 1.75rem;
		}
	}
</style>

{#if $ready}

	<!-- <Modal class="min-w-full" open={$showBigImg} on:close={() => {showBigImg.set(false); }} size="xl">
		<button type="button" on:click={() => {showBigImg.set(false);}} style="padding:0; border:none; background:none;">
			<img style="border-radius:5px" src={$bigImgUrl} alt="">
		</button>
	</Modal> -->

	<!-- <Popover triggeredBy="#about" title={currHover.title}>
		<p><i>(slide right to view more and click to expand!)</i></p>

		<div class="img-wrapper">
			{#each currHover.images as i}
				<img style="cursor:pointer;" on:click={() => {bigImgUrl.set(i); showBigImg.set(true);}} alt="" src={i}>
			{/each}
		</div>
		
	</Popover> -->

	<Section name="blog">
		<h2 class="title-text">Projects</h2>
		<!-- <p class="subtitle-text">(Hover over the title to view more pictures from each project)</p> -->
		<div class="outer-container">
			<div class="wholeclubwrapper">
				<div class="card-container">
					{#each Array(columns) as _, colIndex}
						{#if projects.filter((_, i) => i % columns === colIndex).length > 0}
							<div class="masonry-column">
								{#each projects.filter((_, i) => i % columns === colIndex) as p}
									<div class="card" role="button" tabindex="0" on:click={() => {if (p.website.length > 1) window.open(p.website, "_blank")}}>
										<Card size="xl" img={p.images[0]} class="rounded-lg overflow-hidden shadow-lg">
											<div class="card-contents">
												<h5 class="mb-3 text-2xl font-bold tracking-tight text-gray-900">
													<div class="title-txt-wrapper">
														<a on:mouseover={() => {currHover = p}} on:focus={() => {currHover = p}} class="title" id="about" href="#">
															{p.title}
														</a>
														<ArrowUpRightFromSquareOutline class="shrink-0 h-5 w-5 text-gray-600" />
													</div>
												</h5>
												{#if expandedProjects.has(p.id || p.title)}
													<p class="full-description mb-4 font-normal text-gray-700 leading-relaxed">{p.about}</p>
													<button 
														class="view-more-btn" 
														on:click|stopPropagation={() => toggleExpand(p.id || p.title)}
													>
														View Less
													</button>
												{:else}
													<ul class="bullet-points mb-4">
														{#each getBulletPoints(p.about) as bullet}
															<li>{@html bullet}</li>
														{/each}
													</ul>
													<button 
														class="view-more-btn" 
														on:click|stopPropagation={() => toggleExpand(p.id || p.title)}
													>
														View More
													</button>
												{/if}
												<div class="github-links-wrapper">
													{#if p["github-link-frontend"]?.length > 2}
														<a href={p["github-link-frontend"]} class="gh-link" on:click|stopPropagation target="_blank">View Frontend</a>
													{/if}
													{#if p["github-link-backend"]?.length > 2}
														<a href={p["github-link-backend"]} class="gh-link" on:click|stopPropagation target="_blank">View Backend</a>
													{/if}
												</div>
											</div>
										</Card>
									</div>
								{/each}
							</div>
						{/if}
					{/each}
				</div>
			</div>
		</div>
	</Section>

	
	

	

{/if}