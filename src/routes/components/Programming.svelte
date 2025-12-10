<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { getDocuments } from "$lib/model";
    import { writable } from "svelte/store";

	let ready = writable(false);
	let pg = [];
	let hoveredIndex = writable(null);

	onMount(async () => {
		ready.set(false);
		pg = await getDocuments("Programming");
		ready.set(true);
	})

	function getProficiencyValue(proficiency) {
		const levels = {
			'Beginner': 30,
			'Intermediate': 60,
			'Advanced': 85,
			'Expert': 100
		};
		// Try to match any part of the proficiency string
		for (let [key, value] of Object.entries(levels)) {
			if (proficiency && proficiency.toLowerCase().includes(key.toLowerCase())) {
				return value;
			}
		}
		// Default to intermediate if no match
		return 60;
	}
</script>

<style>
	.section-title {
		color: white;
		font-size: 2.5rem;
		font-weight: 700;
		text-align: center;
		margin-bottom: 4rem;
		background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.hexagon-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;
		gap: 1.5rem;
		padding: 3rem 2rem;
		max-width: 1600px;
		margin: 0 auto;
		perspective: 2000px;
	}

	.hexagon-wrapper {
		position: relative;
		opacity: 0;
		transform: scale(0.3) rotateZ(180deg);
		animation: hexagonAppear 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
	}

	@keyframes hexagonAppear {
		to {
			opacity: 1;
			transform: scale(1) rotateZ(0deg);
		}
	}

	.hexagon-item {
		position: relative;
		width: 180px;
		height: 200px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		transform-style: preserve-3d;
	}

	.hexagon-item:hover {
		transform: translateY(-15px) scale(1.1) rotateY(10deg);
		z-index: 10;
	}

	.hexagon-shape {
		position: absolute;
		width: 100%;
		height: 100%;
		clip-path: polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%);
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%);
		border: 2px solid rgba(147, 197, 253, 0.4);
		backdrop-filter: blur(20px);
		transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.hexagon-item:hover .hexagon-shape {
		background: linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%);
		border-color: rgba(147, 197, 253, 0.8);
		box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5),
					0 0 40px rgba(139, 92, 246, 0.3);
		animation: hexagonPulse 2s ease-in-out infinite;
	}

	@keyframes hexagonPulse {
		0%, 100% {
			box-shadow: 0 20px 60px rgba(59, 130, 246, 0.5),
						0 0 40px rgba(139, 92, 246, 0.3);
		}
		50% {
			box-shadow: 0 20px 60px rgba(59, 130, 246, 0.7),
						0 0 60px rgba(139, 92, 246, 0.5);
		}
	}

	.hexagon-content {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		width: 100%;
		height: 100%;
		padding: 1.5rem;
	}

	.tech-image {
		width: 80px;
		height: 80px;
		object-fit: contain;
		filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
		transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
		animation: float 3s ease-in-out infinite;
	}

	.hexagon-item:hover .tech-image {
		transform: scale(1.2) rotateZ(10deg);
		filter: drop-shadow(0 8px 20px rgba(59, 130, 246, 0.6));
		animation: none;
	}

	@keyframes float {
		0%, 100% {
			transform: translateY(0px);
		}
		50% {
			transform: translateY(-10px);
		}
	}

	.tech-name {
		color: white;
		font-weight: 700;
		font-size: 1rem;
		text-align: center;
		text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
		transition: all 0.3s ease;
		margin-top: 0.5rem;
	}

	.hexagon-item:hover .tech-name {
		color: #93c5fd;
		text-shadow: 0 0 20px rgba(147, 197, 253, 0.8);
		transform: scale(1.1);
	}

	.proficiency-ring {
		position: absolute;
		top: 10px;
		right: 10px;
		width: 50px;
		height: 50px;
		transform: rotate(-90deg);
	}

	.proficiency-ring circle {
		fill: none;
		stroke-width: 4;
		transition: all 0.5s ease;
	}

	.proficiency-ring .bg-circle {
		stroke: rgba(255, 255, 255, 0.1);
	}

	.proficiency-ring .progress-circle {
		stroke: url(#gradient);
		stroke-linecap: round;
		stroke-dasharray: 125.6;
		stroke-dashoffset: 125.6;
		transition: stroke-dashoffset 1.5s ease-out;
	}

	.hexagon-item:hover .proficiency-ring .progress-circle {
		stroke-width: 5;
		filter: drop-shadow(0 0 8px rgba(147, 197, 253, 0.8));
	}

	.proficiency-text {
		position: absolute;
		bottom: 15px;
		left: 50%;
		transform: translateX(-50%);
		color: rgba(255, 255, 255, 0.8);
		font-size: 0.75rem;
		font-weight: 500;
		text-align: center;
		opacity: 0;
		transition: opacity 0.3s ease;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
	}

	.hexagon-item:hover .proficiency-text {
		opacity: 1;
	}

	/* Staggered animation delays */
	.hexagon-wrapper:nth-child(1) { animation-delay: 0.1s; }
	.hexagon-wrapper:nth-child(2) { animation-delay: 0.15s; }
	.hexagon-wrapper:nth-child(3) { animation-delay: 0.2s; }
	.hexagon-wrapper:nth-child(4) { animation-delay: 0.25s; }
	.hexagon-wrapper:nth-child(5) { animation-delay: 0.3s; }
	.hexagon-wrapper:nth-child(6) { animation-delay: 0.35s; }
	.hexagon-wrapper:nth-child(7) { animation-delay: 0.4s; }
	.hexagon-wrapper:nth-child(8) { animation-delay: 0.45s; }
	.hexagon-wrapper:nth-child(9) { animation-delay: 0.5s; }
	.hexagon-wrapper:nth-child(10) { animation-delay: 0.55s; }
	.hexagon-wrapper:nth-child(n+11) { animation-delay: 0.6s; }

	@media (max-width: 1024px) {
		.hexagon-item {
			width: 160px;
			height: 180px;
		}
		.tech-image {
			width: 70px;
			height: 70px;
		}
	}

	@media (max-width: 768px) {
		.section-title {
			font-size: 2rem;
			margin-bottom: 3rem;
		}
		.hexagon-container {
			gap: 1rem;
			padding: 2rem 1rem;
		}
		.hexagon-item {
			width: 140px;
			height: 160px;
		}
		.tech-image {
			width: 60px;
			height: 60px;
		}
		.tech-name {
			font-size: 0.9rem;
		}
	}

	@media (max-width: 480px) {
		.hexagon-container {
			gap: 0.75rem;
			padding: 1.5rem 0.5rem;
		}
		.hexagon-item {
			width: 120px;
			height: 140px;
		}
		.tech-image {
			width: 50px;
			height: 50px;
		}
		.tech-name {
			font-size: 0.8rem;
		}
		.proficiency-ring {
			width: 40px;
			height: 40px;
		}
	}
</style>

{#if $ready}
	<h2 class="section-title">Programming Languages & Technologies</h2>
	<div class="hexagon-container">
		<svg width="0" height="0" style="position: absolute;">
			<defs>
				<linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" style="stop-color:#60a5fa;stop-opacity:1" />
					<stop offset="100%" style="stop-color:#a78bfa;stop-opacity:1" />
				</linearGradient>
			</defs>
		</svg>
		{#each pg as p, index}
			{@const proficiencyValue = getProficiencyValue(p.Proficiency)}
			{@const circumference = 125.6}
			{@const offset = circumference - (proficiencyValue / 100) * circumference}
			<div class="hexagon-wrapper" style="animation-delay: {index * 0.05}s">
				<div class="hexagon-item" 
					 on:mouseenter={() => hoveredIndex.set(index)}
					 on:mouseleave={() => hoveredIndex.set(null)}>
					<div class="hexagon-shape"></div>
					<div class="hexagon-content">
						<img src={p.img} alt={p.name} class="tech-image" />
						<h3 class="tech-name">{p.name}</h3>
						<!-- <div class="proficiency-ring">
							<svg width="50" height="50">
								<circle class="bg-circle" cx="25" cy="25" r="20"></circle>
								<circle class="progress-circle" 
										cx="25" cy="25" r="20"
										style="stroke-dashoffset: {offset}"></circle>
							</svg>
						</div> -->
						<div class="proficiency-text">{p.Proficiency}</div>
					</div>
				</div>
			</div>
		{/each}
	</div>
{/if}