<script>
	import Hero from './components/Hero.svelte';
	import CalCard from './components/CalCard.svelte';
	import Timeline from './components/Timeline.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Rehaan Anjaria</title>
	<meta
		name="description"
		content="Rehaan Anjaria — Civic Tech, Research, AI, Always Building."
	/>

	<!-- The Cal embed is deferred to idle, but the connection to its origin can be
	     opened for free during idle network time, which shaves the handshake. -->
	<link rel="preconnect" href="https://app.cal.com" />
	<link rel="dns-prefetch" href="https://app.cal.com" />
</svelte:head>

<main>
	<!-- Hero: text occupies the left half, the booking card the right half.
	     This is what the "text never crosses the midline" rule is in service of. -->
	<section class="hero-grid">
		<div class="hero-text">
			<Hero />
		</div>
		<div class="hero-cal">
			<CalCard />
		</div>
	</section>

	<!-- The timeline keeps the same left measure, so every bullet hangs off the
	     same left edge as the name above it. -->
	<div class="measure">
		<Timeline timeline={data.timeline} />
	</div>
</main>

<style>
	main {
		min-height: 100svh;
		background: var(--color-base);
		color: var(--color-ink);
		overflow-x: clip;

		/* Gutters: left, right, bottom. No top gutter — the hero is a full-height
		   panel and centres itself within it. */
		padding-left: var(--gutter);
		padding-right: var(--gutter);
		padding-bottom: var(--gutter-bottom);

		--gutter: 1.5rem;
		--gutter-bottom: 5rem;
		--col-gap: 2.5rem;
	}

	/* Phone: single column. The card stacks under the text rather than being
	   squeezed into an unusable sliver. */
	.hero-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: var(--col-gap);
		align-items: center;
		padding-bottom: 4rem;
	}

	/* Grid children default to `min-width: auto`, which lets wide content (the
	   Cal iframe) push a track past its declared size and spill over what comes
	   after it. This is what was putting the calendar on top of the timeline. */
	.hero-text,
	.hero-cal {
		min-width: 0;
	}

	/* The card sizes itself from its own --cal-h x --cal-scale. Giving it a height
	   here as well is what let the two disagree. */
	.hero-cal {
		width: 100%;
	}

	.measure {
		max-width: 100%;
	}

	/* Tablet and up: two true halves. The text column is exactly half the viewport
	   minus the left gutter, so the copy stops dead on the midline and the card
	   owns everything to the right of it. */
	@media (min-width: 900px) {
		main {
			--gutter: 4rem;
			--gutter-bottom: 8rem;
			--col-gap: 3.5rem;
		}

		.hero-grid {
			grid-template-columns: calc(50vw - var(--gutter)) 1fr;
			padding-bottom: 0;
		}

		.measure {
			max-width: calc(50vw - var(--gutter));
		}
	}

	@media (min-width: 1280px) {
		main {
			--gutter: 6rem;
		}
	}
</style>
