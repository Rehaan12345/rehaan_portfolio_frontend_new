<script lang="ts">
	//@ts-nocheck
	import Projects from "./Projects.svelte";
    import TableInfo from "./TableInfo.svelte";
    import AboutMe from "./AboutMe.svelte";
    import Skills from "./Skills.svelte";
    import OtherProjects from "./OtherProjects.svelte";
    import Contact from "./Contact.svelte";
    import ShortBio from "./ShortBio.svelte";
	import Programming from "./Programming.svelte";
    import Nav from "./Nav.svelte";
    import { Section, Schedule, ScheduleItem } from 'flowbite-svelte-blocks';
    import { Button, Modal, GradientButton } from 'flowbite-svelte';
    import { writable } from "svelte/store";
    import { slide, fly } from "svelte/transition";
	import { ProfileCardOutline, BookOpenOutline, GithubSolid } from "flowbite-svelte-icons";

	const URL = import.meta.env.VITE_URL;

    let showResume = writable(false);
	let placement: ModalPlacementType = $state("center");

    import { watch } from 'runed';
	import { onMount } from 'svelte';

	interface Props {
		class?: string;
		quantity?: number;
		staticity?: number;
		ease?: number;
		size?: number;
		refresh?: boolean;
		color?: string;
		vx?: number;
		vy?: number;
	}

	let {
		class: className = '',
		quantity = 100,
		staticity = 50,
		ease = 50,
		size = 0.4,
		refresh = true,
		color = '#ffffff',
		vx = 0,
		vy = 0
	}: Props = $props();

	$inspect(color, 'COLOR');

	let canvasRef: HTMLCanvasElement | undefined = $state(undefined);
	let canvasContainerRef: HTMLDivElement | undefined = $state(undefined);
	let context: CanvasRenderingContext2D | null = null;
	let circles: any[] = $state([]);
	let mouse = $state({ x: 0, y: 0 });
	let canvasSize = $state({ w: 0, h: 0 });
	const dpr = typeof window !== 'undefined' ? window.devicePixelRatio : 1;
	let resizeTimeout = $state<number | null>(null);

	function hexToRgb(hex: string): number[] {
		hex = hex.replace('#', '');

		if (hex.length === 3) {
			hex = hex
				.split('')
				.map((char) => char + char)
				.join('');
		}

		const hexInt = parseInt(hex, 16);
		const red = (hexInt >> 16) & 255;
		const green = (hexInt >> 8) & 255;
		const blue = hexInt & 255;
		return [red, green, blue];
	}

	let rgb = hexToRgb(color);

	function circleParams() {
		const x = Math.floor(Math.random() * canvasSize.w);
		const y = Math.floor(Math.random() * canvasSize.h);
		const translateX = 0;
		const translateY = 0;
		const pSize = Math.floor(Math.random() * 2) + size;
		const alpha = 0;
		const targetAlpha = parseFloat((Math.random() * 0.6 + 0.1).toFixed(1));
		const dx = (Math.random() - 0.5) * 0.1;
		const dy = (Math.random() - 0.5) * 0.1;
		const magnetism = 0.1 + Math.random() * 4;
		return {
			x,
			y,
			translateX,
			translateY,
			size: pSize,
			alpha,
			targetAlpha,
			dx,
			dy,
			magnetism
		};
	}

	function resizeCanvas() {
		if (canvasContainerRef && canvasRef && context) {
			circles.length = 0;
			canvasSize.w = canvasContainerRef.offsetWidth;
			canvasSize.h = canvasContainerRef.offsetHeight;
			canvasRef.width = canvasSize.w * dpr;
			canvasRef.height = canvasSize.h * dpr;
			canvasRef.style.width = `${canvasSize.w}px`;
			canvasRef.style.height = `${canvasSize.h}px`;
			context.scale(dpr, dpr);
		}
	}

	function clearContext() {
		if (context) {
			context.clearRect(0, 0, canvasSize.w, canvasSize.h);
		}
	}

	function drawCircle(circle: any, update = false) {
		if (context) {
			const { x, y, translateX, translateY, size, alpha } = circle;
			context.translate(translateX, translateY);
			context.beginPath();
			context.arc(x, y, size, 0, 2 * Math.PI);
			context.fillStyle = `rgba(${rgb.join(', ')}, ${alpha})`;
			context.fill();
			context.setTransform(dpr, 0, 0, dpr, 0, 0);

			if (!update) {
				circles.push(circle);
			}
		}
	}

	function drawParticles() {
		clearContext();
		for (let i = 0; i < quantity; i++) {
			const circle = circleParams();
			drawCircle(circle);
		}
	}

	function remapValue(value, start1, end1, start2, end2) {
		let remapped = ((value - start1) * (end2 - start2)) / (end1 - start1) + start2;
		return remapped > 0 ? remapped : 0;
	}

	function animate() {
		clearContext();
		circles.forEach((circle, i) => {
			const edge = [
				circle.x + circle.translateX - circle.size,
				canvasSize.w - circle.x - circle.translateX - circle.size,
				circle.y + circle.translateY - circle.size,
				canvasSize.h - circle.y - circle.translateY - circle.size
			];
			const closestEdge = edge.reduce((a, b) => Math.min(a, b));
			const remapClosestEdge = parseFloat(remapValue(closestEdge, 0, 20, 0, 1).toFixed(2));
			if (remapClosestEdge > 1) {
				circle.alpha += 0.02;
				if (circle.alpha > circle.targetAlpha) {
					circle.alpha = circle.targetAlpha;
				}
			} else {
				circle.alpha = circle.targetAlpha * remapClosestEdge;
			}
			circle.x += circle.dx + vx;
			circle.y += circle.dy + vy;
			circle.translateX += (mouse.x / (staticity / circle.magnetism) - circle.translateX) / ease;
			circle.translateY += (mouse.y / (staticity / circle.magnetism) - circle.translateY) / ease;

			drawCircle(circle, true);

			if (
				circle.x < -circle.size ||
				circle.x > canvasSize.w + circle.size ||
				circle.y < -circle.size ||
				circle.y > canvasSize.h + circle.size
			) {
				circles.splice(i, 1);
				const newCircle = circleParams();
				drawCircle(newCircle);
			}
		});
		window.requestAnimationFrame(animate);
	}

	function onMouseMove(event: MouseEvent) {
		if (canvasRef) {
			let rect = canvasRef.getBoundingClientRect();
			let { w, h } = canvasSize;
			let x = event.clientX - rect.left - w / 2;
			let y = event.clientY - rect.top - h / 2;
			let inside = x < w / 2 && x > -w / 2 && y < h / 2 && y > -h / 2;
			if (inside) {
				mouse.x = x;
				mouse.y = y;
			}
		}
	}
	const initCanvas = () => {
		resizeCanvas();
		drawParticles();
	};
	onMount(() => {
		if (canvasRef) {
			context = canvasRef.getContext('2d');
			resizeCanvas();
			// initCanvas();
			animate();
			window.addEventListener('resize', resizeCanvas);
			window.addEventListener('mousemove', onMouseMove);
		}

		return () => {
			window.removeEventListener('resize', resizeCanvas);
			window.removeEventListener('mousemove', onMouseMove);
		};
	});
	watch(
		() => color,
		() => {
			rgb = hexToRgb(color);
			animate();
			initCanvas();
		}
	);

	onMount(() => {
        canvasContainerRef = document.getElementById("wholewholewrapper") as HTMLDivElement;
		if (canvasRef) {
			drawParticles();
		}
        if (canvasContainerRef) {
            console.log("Manually got the element:", canvasContainerRef);
        }
	});
</script>

<style>
	.size-full {
		width: 100%;
		height: 100%;
	}

    .buttons-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 1rem;
		gap: 2rem;
		margin-bottom: 4rem;
		flex-wrap: wrap;
	}

	@media (max-width: 900px) {
		.buttons-wrapper {
			gap: 1rem;
			margin-bottom: 2rem;
		}
	}

	@media (max-width: 600px) {
		.buttons-wrapper {
			flex-direction: column;
			gap: 0.75rem;
			margin-bottom: 1rem;
			padding-top: 0.5rem;
		}
	}

	.button-inside {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: .5rem;
	}

	.button-select {
		transition: all 0.3s ease-in-out;
	}

	.button-select:hover {
		transform: scale(1.1);
		transition: all ease-in-out 0.2s;
	}

	.button-text {
		font-size: larger;
	}

	.button-text:hover {
		border-bottom: 1px solid white;
	}

	.resumemodalwrapper {
		/* position: fixed; */
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 50; /* keeps it above other elements */
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
</style>

<Nav></Nav>

<div class="{className}" bind:this={canvasContainerRef} aria-hidden="true">

	<!-- <Modal bind:open={$showResume}>
			<img src="https://firebasestorage.googleapis.com/v0/b/rehaan-portfolio.firebasestorage.app/o/RehaanAnjariaWork.jpg?alt=media&token=c8caf2b5-60a2-427d-879a-baa8bf3761d6" alt="RehaanAnjariaResume">
	</Modal> -->
    
	<canvas bind:this={canvasRef} class="size-full absolute z-0 pointer-events-none"></canvas>

    <div class="wholewholewrapper z-10 text-white" id="wholewholewrapper">

        <div class="aboutmewrapper">

			<div id="About">
            	<AboutMe></AboutMe>
			</div>
            
            <div class="buttons-wrapper">
				<div class="button-select">
					<!-- svelte-ignore event_directive_deprecated -->
					<button class="resume-buttom" style="cursor:pointer; color:white; border:1px solid white; border-radius: 5px; padding: 1rem;" on:click={() => showResume.set(true)}>
						<a href="/RehaanAnjaria.png" target="_blank">
							<div class="button-inside">
								<BookOpenOutline></BookOpenOutline>
								<div class="button-text">Resume</div>
							</div>
						</a>
					</button>
				</div>
				<div class="button-select">
					<button style="cursor:pointer; color:white; border:1px solid white; border-radius: 5px; padding: 1rem;">
						<a href="https://www.linkedin.com/in/rehaananjaria/" target="_blank">
							<div class="button-inside">
								<ProfileCardOutline/>
								<div class="button-text">LinkedIn</div>
							</div>
						</a>
					</button>
				</div>
				<div class="button-select">
					<button style="cursor:pointer; color:white; border:1px solid white; border-radius: 5px; padding: 1rem;">
						<a href="https://github.com/Rehaan12345" target="_blank">
							<div class="button-inside">
								 <GithubSolid class="shrink-0 h-6 w-6" />
								 <div class="button-text">GitHub</div>
							</div>
						</a>
					</button>
				</div>
            </div>

        </div>

		<div id="Programming">
        	<Programming></Programming>
		</div>

		<!-- <div id="Skills">
        	<Skills></Skills>
		</div> -->

		<div id="Projects">
        	<Projects></Projects>
		</div>

		<div id="Film">
        	<OtherProjects></OtherProjects>
		</div>

		<div id="Contact">
        	<Contact></Contact>
		</div>
    </div>
</div>