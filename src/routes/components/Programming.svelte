<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { Card } from "flowbite-svelte"
    import { getDocuments } from "$lib/model";
    import { writable } from "svelte/store";
    import { fade, fly } from "svelte/transition";

	let ready = writable(false);
	let visible = writable(false);

	let pg = [];

	onMount(async () => {
		ready.set(false);
		pg = await getDocuments("Programming");
		ready.set(true);
		// Trigger animation after a short delay
		setTimeout(() => {
			visible.set(true);
		}, 100);
	})
</script>

<style>
	.section-title {
		color: white;
		font-size: 2.5rem;
		font-weight: 700;
		text-align: center;
		margin-bottom: 3rem;
	}

	.grid-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 2rem;
		padding: 2rem;
		max-width: 1400px;
		margin: 0 auto;
	}

    .card-wrapper {
        width: 100%;
		opacity: 0;
		transform: scale(0.8) translateY(20px);
		animation: cardAppear 0.6s ease forwards;
    }

	@keyframes cardAppear {
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}

	.card-wrapper:nth-child(1) { animation-delay: 0.1s; }
	.card-wrapper:nth-child(2) { animation-delay: 0.2s; }
	.card-wrapper:nth-child(3) { animation-delay: 0.3s; }
	.card-wrapper:nth-child(4) { animation-delay: 0.4s; }
	.card-wrapper:nth-child(5) { animation-delay: 0.5s; }
	.card-wrapper:nth-child(6) { animation-delay: 0.6s; }
	.card-wrapper:nth-child(7) { animation-delay: 0.7s; }
	.card-wrapper:nth-child(8) { animation-delay: 0.8s; }
	.card-wrapper:nth-child(9) { animation-delay: 0.9s; }
	.card-wrapper:nth-child(10) { animation-delay: 1.0s; }
	.card-wrapper:nth-child(n+11) { animation-delay: 1.1s; }

	.card-contents {
		padding: 1.5rem;
		background: linear-gradient(135deg, rgba(148, 163, 184, 0.95) 0%, rgba(226, 232, 240, 0.95) 100%);
		backdrop-filter: blur(10px);
		border-radius: 16px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.card-wrapper:hover .card-contents {
		transform: translateY(-10px) rotateY(5deg) rotateX(-5deg);
		box-shadow: 0 20px 40px rgba(59, 130, 246, 0.3);
		background: linear-gradient(135deg, rgba(165, 180, 200, 0.95) 0%, rgba(241, 245, 249, 0.95) 100%);
	}

    .img-wrapper {
		display: flex;
		justify-content: center;
		margin-bottom: 1rem;
		perspective: 1000px;
	}

    .img-wrapper img {
        width: 120px;
        height: 120px;
        object-fit: contain;
		border-radius: 12px;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2));
    }

	.card-wrapper:hover .img-wrapper img {
		transform: scale(1.15) rotateZ(5deg);
		filter: drop-shadow(0 8px 16px rgba(59, 130, 246, 0.4));
	}

    .name {
        font-weight: 700;
		font-size: 1.25rem;
		color: #1e293b;
		margin-bottom: 0.5rem;
		transition: color 0.3s ease;
    }

	.card-wrapper:hover .name {
		color: #3b82f6;
	}

    .proff {
        margin-top: 0.75rem;
        font-style: italic;
		color: #475569;
		font-size: 0.9rem;
    }

    .p-proff {
        font-style: normal;
        font-size: 1.1rem;
		font-weight: 600;
		color: #1e293b;
		margin-top: 0.25rem;
    }

	@media (max-width: 768px) {
		.section-title {
			font-size: 2rem;
			margin-bottom: 2rem;
		}
		.grid-container {
			grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
			gap: 1.5rem;
			padding: 1rem;
		}
	}

	@media (max-width: 480px) {
		.grid-container {
			grid-template-columns: 1fr;
		}
	}
</style>

{#if $ready}
	<h2 class="section-title">Programming Languages & Technologies</h2>
	<div class="grid-container">
		{#each pg as p, index}
			<div class="card-wrapper" style="animation-delay: {index * 0.1}s">
				<Card class="rounded-lg overflow-hidden border-0 shadow-lg h-full">
					<div class="card-contents">
						<div class="img-wrapper">
							<img src={p.img} alt={p.name}>
						</div>
						<div>
							<h5 class="name">{p.name}</h5>
							<div class="proff">
								Proficiency: 
								<p class="p-proff">{p.Proficiency}</p>
							</div>
						</div>
					</div>
				</Card>
			</div>
		{/each}
	</div>
{/if}