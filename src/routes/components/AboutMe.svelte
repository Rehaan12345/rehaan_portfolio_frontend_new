<script lang="js">
    import { onMount } from 'svelte';
    import { Section, Quotes, Testimonial } from 'flowbite-svelte-blocks';
    import { getDocuments } from '$lib/model';
    import { writable } from 'svelte/store';
	import Contact from './Contact.svelte';

    let ready = writable(false);
    let info;
    let displayedInfo = '';
    let typingInterval = 15; // ms per character
    let typingTimeout;

    onMount(async () => {
        ready.set(false);
        const aboutDocs = await getDocuments("about");
        info = aboutDocs[0].info;
        displayedInfo = '';
        if (info) {
            let i = 0;
            function typeNext() {
                if (i <= info.length) {
                    displayedInfo = info.slice(0, i);
                    i++;
                    typingTimeout = setTimeout(typeNext, typingInterval);
                }
            }
            typeNext();
        }
        ready.set(true);
    });

    // Optional: clear timeout if component unmounts
    // onDestroy(() => clearTimeout(typingTimeout));
</script>

<style>
	.quoteimgwrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 3rem;
		padding: 2rem;
		backdrop-filter: blur(20px);
		background: rgba(30, 41, 59, 0.4);
		border: 1px solid rgba(148, 163, 184, 0.2);
		border-radius: 20px;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	}

	.quoteimgwrapper .abt-txt {
		max-width: 600px;
		font-size: 1.25rem;
		line-height: 1.8;
		color: rgba(255, 255, 255, 0.95);
	}

	.quoteimgwrapper .rehaanimg {
		width: 250px;
		height: 250px;
		object-fit: contain;
		flex-shrink: 0;
		border-radius: 20px;
		transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		background: rgba(15, 23, 42, 0.3);
	}

	.rehaanimg:hover {
		transform: scale(1.05) translateY(-5px);
		box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
	}

	.imgwrapper {
		transition: all 0.3s ease;
		display: inline-block;
		flex-shrink: 0;
	}

	.imgwrapper:hover {
		transform: scale(1.02);
	}

	@media (max-width: 768px) {
		.quoteimgwrapper {
			flex-direction: column;
			text-align: center;
			gap: 2rem;
			padding: 1.5rem;
		}
		.quoteimgwrapper .abt-txt {
			font-size: 1.1rem;
			max-width: 100%;
		}
		.quoteimgwrapper .rehaanimg {
			width: 200px;
			height: 200px;
		}
	}

	@media (max-width: 480px) {
		.quoteimgwrapper {
			padding: 1rem;
		}
		.quoteimgwrapper .abt-txt {
			font-size: 1rem;
		}
		.quoteimgwrapper .rehaanimg {
			width: 180px;
			height: 180px;
		}
	}
</style>

{#if $ready}

	<Section name="testimonial">
		<Testimonial Icon={Quotes}>
			<div class="quoteimgwrapper">
				<p class="abt-txt font-medium">
					{displayedInfo}
					<span class="inline-block w-1 h-6 bg-white ml-1 animate-pulse"></span>
				</p>
				<a href="https://www.linkedin.com/in/rehaananjaria/" target="_blank" class="imgwrapper">
					<img class="rehaanimg" src="https://firebasestorage.googleapis.com/v0/b/droneworks-14880.appspot.com/o/goodpfp.png?alt=media&token=d203dde8-d9ac-4101-a96f-0bacad845d0f" alt="RehaanAnjaria">
				</a>
			</div>
		</Testimonial>
	</Section>
{/if}