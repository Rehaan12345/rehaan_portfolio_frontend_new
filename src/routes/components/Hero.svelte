<script>
	/**
	 * Hero — the name, the four facets, and the scroll cue.
	 *
	 * The name "flutters in": letters scramble and resolve left-to-right.
	 *
	 * Two constraints shape how that is built:
	 *  1. This page is prerendered. `display` is initialised to the real name, so
	 *     the static HTML contains "Rehaan Anjaria". If JS never runs, the name is
	 *     simply there, unscrambled. The effect only ever *replaces* good text.
	 *  2. The <h1> carries an aria-label, so assistive tech announces the real name
	 *     and never reads out the intermediate gibberish.
	 */
	const NAME = 'Rehaan Anjaria';
	const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

	const facets = ['Civic Tech', 'Research', 'AI', 'Always Building'];

	/** Rendered name. Starts as the truth; the scramble only runs client-side. */
	let display = $state(NAME);

	/** Fluttering cadence. Slow enough to read as letters, not as blur. */
	const FRAME_MS = 45;
	const HOLD_MS = 90; // scramble before the first letter locks
	const LOCK_MS = 55; // each subsequent letter locks this much later

	$effect(() => {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		const start = performance.now();
		const end = HOLD_MS + NAME.length * LOCK_MS;
		let painted = -1;
		/** @type {number} */
		let raf;

		const tick = (/** @type {number} */ now) => {
			const elapsed = now - start;

			// Throttle repaints to FRAME_MS so letters flutter rather than smear.
			const frame = Math.floor(elapsed / FRAME_MS);
			if (frame !== painted) {
				painted = frame;
				let out = '';
				for (let i = 0; i < NAME.length; i++) {
					const char = NAME[i];
					if (char === ' ') {
						out += ' ';
					} else if (elapsed >= HOLD_MS + i * LOCK_MS) {
						out += char; // locked
					} else {
						out += GLYPHS[(Math.random() * GLYPHS.length) | 0];
					}
				}
				display = out;
			}

			if (elapsed < end) {
				raf = requestAnimationFrame(tick);
			} else {
				display = NAME; // always settle on the truth
			}
		};

		raf = requestAnimationFrame(tick);
		return () => {
			cancelAnimationFrame(raf);
			display = NAME;
		};
	});
</script>

<section class="hero">
	<!-- Structural accent: the one place green reads at full strength. -->
	<div class="rise accent-rule" aria-hidden="true"></div>

	<h1 class="rise name" aria-label={NAME}>{display}</h1>

	<ul class="facets">
		{#each facets as facet, i}
			<li class="rise facet" style="animation-delay: {260 + i * 80}ms">
				<span class="tick" class:harbor={i % 2 === 1} aria-hidden="true"></span>
				{facet}
			</li>
		{/each}
	</ul>

	<p class="rise scroll-cue">
		<span class="cue-rule" aria-hidden="true"></span>
		Scroll for my story
	</p>
</section>

<style>
	/* On phones the card stacks BELOW this, so forcing a 100svh hero would push
	   the calendar a full screen down and the timeline two screens down. Full
	   height is a two-column (desktop) behaviour only. */
	.hero {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding-top: 5rem;
	}

	@media (min-width: 900px) {
		.hero {
			min-height: 100svh;
			padding-top: 0;
		}
	}

	/* Entrance. Pure CSS: runs without JS, and every keyframe ENDS at opacity 1,
	   so the resting state is always visible. Only opacity/transform animate —
	   nothing reflows.
	   NB: the `animation` shorthand resets animation-delay, so each delay below
	   is declared *after* this rule. Reordering silently kills the stagger. */
	.rise {
		animation: rise 700ms cubic-bezier(0.22, 0.61, 0.36, 1) both;
	}

	.accent-rule {
		height: 1px;
		width: 2.5rem;
		background: var(--color-moss);
		animation-delay: 60ms;
	}

	/* Fluid from 360px to ultrawide without a breakpoint. The name wraps inside
	   the half-width measure by design — the user asked for wrapping. */
	.name {
		margin: 1.5rem 0 0;
		font-size: clamp(2.5rem, 7vw, 6rem);
		font-weight: 600;
		line-height: 0.98;
		letter-spacing: -0.035em;
		color: var(--color-ink);
		animation-delay: 140ms;

		/* Wrap only at the space between the two words. Deliberately NOT
		   `overflow-wrap: anywhere` — the scramble swaps glyph widths every 45ms,
		   and letting it break mid-word would make the wrap point jitter on every
		   frame. Both words are fixed-length, so the break stays put. */
		overflow-wrap: normal;
	}

	.facets {
		margin: 2rem 0 0;
		padding: 0;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1.75rem;
		list-style: none;
	}

	.facet {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.tick {
		flex: none;
		width: 1px;
		height: 0.75rem;
		background: var(--color-moss);
	}

	.tick.harbor {
		background: var(--color-harbor);
	}

	/* Scroll cue — left-aligned to the name, deliberately quiet. */
	.scroll-cue {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin: 3.5rem 0 0;
		font-size: 0.8125rem;
		letter-spacing: 0.04em;
		color: var(--color-faint);
		animation-delay: 700ms;
	}

	.cue-rule {
		flex: none;
		width: 1.5rem;
		height: 1px;
		background: var(--color-line);
		animation: drift 2.4s ease-in-out infinite;
		transform-origin: left center;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	/* A slow horizontal breath on the cue rule. Nothing bright, nothing loud. */
	@keyframes drift {
		0%,
		100% {
			transform: scaleX(1);
			opacity: 0.7;
		}
		50% {
			transform: scaleX(1.6);
			opacity: 1;
		}
	}

	@media (min-width: 640px) {
		.name {
			margin-top: 1.75rem;
		}

		.facet {
			font-size: 0.8125rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.rise,
		.cue-rule {
			animation: none;
		}
	}
</style>
