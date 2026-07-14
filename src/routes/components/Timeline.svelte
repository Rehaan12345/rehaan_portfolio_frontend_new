<script>
	/**
	 * Timeline — chronological progression, rendered verbatim from timeline.json.
	 *
	 * Data is passed in by the parent (never imported here) so the component stays
	 * a pure view. Nesting is handled recursively by a self-referencing snippet, so
	 * any depth renders; only the *styling* buckets cap out at level 3.
	 *
	 * Prerendering note: this component renders fully visible. The "hidden" state
	 * used for scroll reveal is gated behind the `anim` class, which only JS adds
	 * on mount. With JS disabled the CSS that hides things never applies, so the
	 * static HTML shows the finished timeline.
	 */
	/**
	 * @typedef {{ text: string, children?: TimelineItem[] }} TimelineItem
	 * @typedef {{ period: string, items: TimelineItem[] }} TimelinePeriod
	 * @typedef {{ text: string, depth: number, order: number, children: DecoratedItem[] }} DecoratedItem
	 */

	/** @type {{ timeline?: TimelinePeriod[] }} */
	let { timeline = [] } = $props();

	/** Root <ol>, used to find the period elements to observe. @type {HTMLOListElement | null} */
	let root = $state(null);

	/** Set to true only by JS on mount (and only when motion is allowed). */
	let anim = $state(false);

	/** Which periods have scrolled into view. @type {boolean[]} */
	let revealed = $state([]);

	/**
	 * Decorate the raw tree with a pre-order index per period, so the reveal can
	 * cascade heading -> bullet -> sub-bullet in reading order. No content is
	 * added, removed, or altered — only `depth` and `order` metadata.
	 */
	const periods = $derived(
		(timeline ?? []).map((period) => {
			let order = 0;
			/** @type {(items: TimelineItem[], depth: number) => DecoratedItem[]} */
			const decorate = (items, depth) =>
				(items ?? []).map((item) => ({
					text: item.text,
					depth,
					order: ++order,
					children: item.children ? decorate(item.children, depth + 1) : []
				}));
			return { period: period.period, items: decorate(period.items, 1) };
		})
	);

	/** Subtle stagger, capped so a 16-bullet period never crawls. */
	const STEP_MS = 45;
	const MAX_DELAY_MS = 380;
	/** @param {number} order */
	const delay = (order) => Math.min(order * STEP_MS, MAX_DELAY_MS);

	$effect(() => {
		if (!root) return;

		// Reduced motion: leave `anim` false, so nothing is ever hidden and no
		// observer runs. Content is simply there.
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
		if (reduced.matches) return;

		anim = true;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					const el = /** @type {HTMLElement} */ (entry.target);
					revealed[Number(el.dataset.period)] = true;
					observer.unobserve(el);
				}
			},
			{ threshold: 0, rootMargin: '0px 0px -12% 0px' }
		);

		for (const el of root.querySelectorAll('[data-period]')) observer.observe(el);

		return () => observer.disconnect();
	});
</script>

{#snippet branch(/** @type {DecoratedItem[]} */ items, /** @type {number} */ depth)}
	<ul class="branch" class:nested={depth > 1}>
		{#each items as item (item.order)}
			<li>
				<div
					class="node reveal"
					class:d1={depth === 1}
					class:d2={depth === 2}
					class:d3={depth >= 3}
					style="--d: {delay(item.order)}ms"
				>
					<span class="marker" aria-hidden="true"></span>
					<span class="node-text">{item.text}</span>
				</div>

				{#if item.children.length > 0}
					{@render branch(item.children, depth + 1)}
				{/if}
			</li>
		{/each}
	</ul>
{/snippet}

<ol bind:this={root} class="timeline" class:anim>
	{#each periods as period, i (period.period)}
		<li class="period" class:revealed={revealed[i]} data-period={i}>
			<span class="node-marker" aria-hidden="true"></span>

			<h3 class="reveal period-heading" style="--d: 0ms">{period.period}</h3>

			{@render branch(period.items, 1)}
		</li>
	{/each}
</ol>

<style>
	/* ---------------------------------------------------------------------
	   Structure. The spine and the markers are the only places colour lives;
	   everything else is white / grey on near-black.
	   --------------------------------------------------------------------- */
	.timeline {
		position: relative;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* The spine: a 1px rule, green fading to blue, fading out at both ends. */
	.timeline::before {
		content: '';
		position: absolute;
		top: 0.5rem;
		bottom: 0.5rem;
		left: 5px;
		width: 1px;
		background: linear-gradient(
			to bottom,
			transparent,
			var(--color-moss-dim) 8%,
			var(--color-moss) 35%,
			var(--color-harbor) 75%,
			var(--color-harbor-dim) 94%,
			transparent
		);
		opacity: 0.75;
	}

	.period {
		position: relative;
		padding-left: 1.5rem;
		padding-bottom: 2.5rem;
	}

	.period:last-child {
		padding-bottom: 0;
	}

	/* Node on the spine, level with the period heading. */
	.node-marker {
		position: absolute;
		top: 0.45rem;
		left: 0;
		width: 11px;
		height: 11px;
		border-radius: 9999px;
		background: var(--color-base);
		border: 1px solid var(--color-moss);
		box-sizing: border-box;
	}

	.period-heading {
		margin: 0 0 0.75rem;
		font-size: 1rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--color-ink);
	}

	.branch {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	/* Nested levels — the "tabs". A faint rule carries the indent. */
	.branch.nested {
		margin-top: 0.3rem;
		margin-left: 0.25rem;
		padding-left: 0.75rem;
		border-left: 1px solid var(--color-line);
	}

	.branch > li {
		margin-bottom: 0.45rem;
	}

	.branch > li:last-child {
		margin-bottom: 0;
	}

	.node {
		display: flex;
		align-items: baseline;
		gap: 0.55rem;
		min-width: 0;
	}

	.node-text {
		min-width: 0;
		overflow-wrap: anywhere;
	}

	.marker {
		flex: none;
		margin-top: 0.1rem;
	}

	/* Depth hierarchy: progressively smaller and dimmer, but never below the
	   4.5:1 contrast floor — `faint` is the dimmest grey used, at 4.6:1. */
	.d1 {
		font-size: 0.95rem;
		line-height: 1.55;
		color: var(--color-muted);
	}

	.d1 .marker {
		width: 5px;
		height: 5px;
		border-radius: 9999px;
		background: var(--color-moss);
	}

	.d2 {
		font-size: 0.875rem;
		line-height: 1.55;
		color: var(--color-faint);
	}

	.d2 .marker {
		width: 6px;
		height: 1px;
		background: var(--color-harbor);
	}

	.d3 {
		font-size: 0.8125rem;
		line-height: 1.5;
		color: var(--color-faint);
	}

	.d3 .marker {
		width: 4px;
		height: 1px;
		background: var(--color-faint);
	}

	@media (min-width: 640px) {
		.period {
			padding-left: 1.75rem;
		}

		.period-heading {
			font-size: 1.125rem;
		}

		.branch.nested {
			padding-left: 1rem;
		}
	}

	/* ---------------------------------------------------------------------
	   Reveal. Everything above renders VISIBLE by default — that is what the
	   prerendered HTML and any no-JS visitor gets. The hidden state below only
	   exists once JS has added `.anim` to the root.
	   --------------------------------------------------------------------- */
	.timeline.anim .reveal {
		opacity: 0;
		transform: translateY(14px);
	}

	/* Transition is declared on the *revealed* state, so applying `.anim` on
	   mount hides instantly rather than visibly fading out. */
	.timeline.anim .period.revealed .reveal {
		opacity: 1;
		transform: none;
		transition:
			opacity 520ms ease-out,
			transform 520ms cubic-bezier(0.22, 0.61, 0.36, 1);
		transition-delay: var(--d, 0ms);
	}

	/* Belt and braces: if the preference flips after mount, drop the motion. */
	@media (prefers-reduced-motion: reduce) {
		.timeline.anim .reveal,
		.timeline.anim .period.revealed .reveal {
			opacity: 1;
			transform: none;
			transition: none;
		}
	}
</style>
