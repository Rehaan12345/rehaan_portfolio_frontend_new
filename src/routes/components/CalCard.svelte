<script>
	/**
	 * Cal.com inline booking embed, in a card.
	 *
	 * Three things shape this:
	 *
	 * 1. PRERENDERING. The page is static HTML. Cal's loader touches `document`
	 *    and `window`, so it must never run on the server. It lives in `$effect`,
	 *    which is client-only.
	 *
	 * 2. FIRST PAINT. Cal pulls a script from app.cal.com which then mounts an
	 *    iframe — a few hundred KB of third-party code. Loading it eagerly would
	 *    make it compete with the hero for bandwidth and main-thread time on the
	 *    very first paint. So it's deferred to the first idle moment after the
	 *    page is interactive. The card is visible immediately either way.
	 *
	 * 3. IDEMPOTENCE. Cal's snippet is written to be dropped once into a static
	 *    page. Under HMR / re-mount it would happily initialise twice, so the
	 *    loader is guarded.
	 */
	const NAMESPACE = '30min';
	const CAL_LINK = 'rehaan-anjaria/30min';
	const MOUNT_ID = 'my-cal-inline-30min';
	const ORIGIN = 'https://app.cal.com';
	const EMBED_JS = 'https://app.cal.com/embed/embed.js';

	let mounted = $state(false);

	/** The card element, watched so the floating button can take over off screen. */
	let card = $state(/** @type {HTMLElement | null} */ (null));

	/**
	 * Cal.com's official loader, transcribed from their snippet. It bootstraps a
	 * `window.Cal` command queue, then lazily appends embed.js the first time a
	 * command is pushed.
	 * @param {any} C window
	 * @param {string} A script url
	 * @param {string} L the "init" verb
	 */
	function installCalQueue(C, A, L) {
		const p = (/** @type {any} */ a, /** @type {any} */ ar) => a.q.push(ar);
		const d = C.document;
		C.Cal =
			C.Cal ||
			function () {
				const cal = C.Cal;
				const ar = arguments;
				if (!cal.loaded) {
					cal.ns = {};
					cal.q = cal.q || [];
					d.head.appendChild(d.createElement('script')).src = A;
					cal.loaded = true;
				}
				if (ar[0] === L) {
					const api = function () {
						p(api, arguments);
					};
					const namespace = ar[1];
					api.q = api.q || [];
					if (typeof namespace === 'string') {
						cal.ns[namespace] = cal.ns[namespace] || api;
						p(cal.ns[namespace], ar);
						p(cal, ['initNamespace', namespace]);
					} else {
						p(cal, ar);
					}
					return;
				}
				p(cal, ar);
			};
	}

	/** Bring up the Cal command queue + the inline embed. Safe to call twice. */
	function bootCal() {
		const w = /** @type {any} */ (window);
		if (w.__calBooted) return;
		w.__calBooted = true;

		installCalQueue(w, EMBED_JS, 'init');

		w.Cal('init', NAMESPACE, { origin: ORIGIN });
		w.Cal.config = w.Cal.config || {};
		w.Cal.config.forwardQueryParams = true;

		w.Cal.ns[NAMESPACE]('inline', {
			elementOrSelector: `#${MOUNT_ID}`,
			config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' },
			calLink: CAL_LINK
		});

		// theme:"dark" is the one thing added to your snippet — Cal defaults to a
		// white widget, which would be the brightest thing on a near-black page.
		// The namespace is shared, so the floating popup inherits this too.
		w.Cal.ns[NAMESPACE]('ui', {
			hideEventTypeDetails: false,
			layout: 'month_view',
			theme: 'dark'
		});

		mounted = true;
	}

	/**
	 * Create the floating button — but only the first time the card actually
	 * leaves the viewport. Cal has no API to destroy a floating button, and
	 * calling `floatingButton` twice would mount two of them, so this is a
	 * one-way door. After it exists, visibility is pure CSS.
	 */
	function ensureFloatingButton() {
		const w = /** @type {any} */ (window);
		if (w.__calFabBooted) return;
		w.__calFabBooted = true;

		bootCal(); // no-op if the idle boot already ran; matters if the user
		// scrolls past the card before the browser goes idle.

		w.Cal.ns[NAMESPACE]('floatingButton', {
			calLink: CAL_LINK,
			config: { layout: 'month_view', useSlotsViewOnSmallScreen: 'true' }
		});
	}

	// 1. Boot the inline embed at the first idle moment after first paint.
	$effect(() => {
		const w = /** @type {any} */ (window);

		if (w.__calBooted) {
			mounted = true;
			return;
		}

		/** @type {number} */
		let handle;

		// requestIdleCallback isn't in Safari < 16.4.
		if ('requestIdleCallback' in w) {
			handle = w.requestIdleCallback(bootCal, { timeout: 2000 });
			return () => w.cancelIdleCallback?.(handle);
		}
		handle = w.setTimeout(bootCal, 200);
		return () => clearTimeout(handle);
	});

	/**
	 * Find whatever node Cal appended for the floating button.
	 *
	 * Deliberately not a hardcoded CSS rule in app.css: if Cal's tag name differs
	 * from what we assume, a stylesheet selector would silently never match and
	 * the button would be stuck visible forever. Querying — and falling back to
	 * "any <cal-*> custom element on <body>" — degrades to *no toggle* rather
	 * than to a broken one, and we style the node directly once we have it.
	 * @returns {HTMLElement | null}
	 */
	function findFab() {
		return /** @type {HTMLElement | null} */ (
			document.querySelector('cal-floating-button') ??
				document.getElementById('cal-floating-button') ??
				[...document.body.children].find((el) => el.tagName.startsWith('CAL-')) ??
				null
		);
	}

	/** @param {HTMLElement} el @param {boolean} visible */
	function paintFab(el, visible) {
		el.style.transition = 'opacity 260ms ease, transform 260ms ease';
		el.style.opacity = visible ? '1' : '0';
		el.style.transform = visible ? 'none' : 'translateY(12px)';
		el.style.pointerEvents = visible ? 'auto' : 'none';
	}

	// 2. Show the floating button only while the card is off screen.
	$effect(() => {
		if (!card) return;

		/** @type {HTMLElement | null} */
		let fab = null;
		/** @type {number | undefined} */
		let poll;
		let offScreen = false;

		// Cal mounts the button asynchronously (after embed.js lands), so we can't
		// grab it the moment we ask for it. Poll briefly, then give up.
		const grab = (/** @type {number} */ tries) => {
			fab = findFab();
			if (fab) {
				paintFab(fab, offScreen);
				return;
			}
			if (tries > 0) poll = window.setTimeout(() => grab(tries - 1), 200);
		};

		const observer = new IntersectionObserver(
			([entry]) => {
				offScreen = !entry.isIntersecting;

				if (offScreen) {
					ensureFloatingButton();
					if (!fab) grab(25); // ~5s of polling, once
				}

				if (fab) paintFab(fab, offScreen);
			},
			{ threshold: 0 }
		);

		observer.observe(card);

		return () => {
			observer.disconnect();
			clearTimeout(poll);
			if (fab) paintFab(fab, false);
		};
	});
</script>

<div class="card" bind:this={card}>
	<!-- Hairline top edge: the same green→blue the timeline spine uses. -->
	<div class="edge" aria-hidden="true"></div>

	<div class="card-head">
		<span class="dot" aria-hidden="true"></span>
		<span class="card-label">Book a time</span>
	</div>

	<div class="cal-frame">
		{#if !mounted}
			<div class="placeholder" aria-hidden="true">
				<span class="pulse"></span>
			</div>
		{/if}

		<!-- Cal mounts its iframe into this node by id. NOTE: the id is also
		     hardcoded in the :global() selector below, which is what pins Cal's
		     auto-resize. Change one, change both. -->
		<div id={MOUNT_ID} class="cal-mount"></div>
	</div>
</div>

<style>
	.card {
		/* Intrinsic height Cal gets to render into, and how far it is scaled down.
		   Overridden per-breakpoint below. */
		--cal-h: 660px;
		--cal-scale: 0.62;

		position: relative;
		display: flex;
		flex-direction: column;
		min-width: 0;
		overflow: hidden;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background:
			radial-gradient(120% 90% at 0% 0%, rgb(47 107 84 / 0.09), transparent 60%),
			radial-gradient(120% 90% at 100% 100%, rgb(36 85 122 / 0.1), transparent 60%),
			var(--color-surface);
		box-shadow:
			0 1px 0 0 rgb(255 255 255 / 0.03) inset,
			0 24px 60px -24px rgb(0 0 0 / 0.7);
	}

	/* 1px gradient hairline across the top edge. Structural colour, not a fill. */
	.edge {
		height: 1px;
		flex: none;
		background: linear-gradient(
			to right,
			transparent,
			var(--color-moss) 25%,
			var(--color-harbor) 75%,
			transparent
		);
		opacity: 0.8;
	}

	.card-head {
		display: flex;
		flex: none;
		align-items: center;
		gap: 0.6rem;
		padding: 0.9rem 1.1rem;
		border-bottom: 1px solid var(--color-line);
	}

	.dot {
		width: 6px;
		height: 6px;
		flex: none;
		border-radius: 9999px;
		background: var(--color-moss);
	}

	.card-label {
		font-size: 0.75rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	/* Sizing the embed.
	   --------------------------------------------------------------------------
	   Cal's month_view has an intrinsic height it will not go below (~660px); it
	   also AUTO-RESIZES the element it mounts into, writing an inline `height`
	   onto that node. That inline style beats any class, which is why the widget
	   was growing out of the card and colliding with the timeline.

	   So: give the mount its natural height, then scale the whole thing down with
	   a transform. The calendar renders complete (no internal scrolling, no
	   cropping) but occupies `height x scale` on the page. Transforms preserve
	   hit-testing, so clicks still land on the right day.

	   The frame is a hard box with overflow:hidden — nothing can escape it. */
	.cal-frame {
		position: relative;
		flex: none;
		height: calc(var(--cal-h) * var(--cal-scale));
		overflow: hidden;
	}

	.cal-mount {
		transform: scale(var(--cal-scale));
		transform-origin: top left;
	}

	/* !important is load-bearing: it is the only thing that outranks the inline
	   height Cal writes onto this node on every resize. */
	.cal-frame :global(#my-cal-inline-30min) {
		width: calc(100% / var(--cal-scale)) !important;
		height: var(--cal-h) !important;
		max-height: var(--cal-h) !important;
		/* auto, not hidden: if Cal ever needs more room than --cal-h, it scrolls
		   inside the card rather than having its bottom row silently cropped. */
		overflow: auto !important;
	}

	/* Scale tuning. Lower scale = Cal believes it has MORE room (the mount is
	   sized 100%/scale), so the month grid stays intact instead of collapsing —
	   while occupying less of the page. */
	@media (min-width: 900px) {
		.card {
			--cal-h: 680px;
			--cal-scale: 0.6;
		}
	}

	@media (min-width: 1280px) {
		.card {
			--cal-scale: 0.68;
		}
	}

	@media (min-width: 1600px) {
		.card {
			--cal-scale: 0.76;
		}
	}

	/* Shown until Cal boots, so the card is never an empty hole. */
	.placeholder {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pulse {
		width: 1.75rem;
		height: 1px;
		background: var(--color-line);
		animation: breathe 1.8s ease-in-out infinite;
	}

	@keyframes breathe {
		0%,
		100% {
			opacity: 0.4;
			transform: scaleX(1);
		}
		50% {
			opacity: 1;
			transform: scaleX(1.7);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pulse {
			animation: none;
		}
	}
</style>
