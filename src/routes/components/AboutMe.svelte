<script lang="js">
    import { onMount } from 'svelte';
    import { Section, Quotes, Testimonial } from 'flowbite-svelte-blocks';
    import { getDocuments } from '$lib/model';
    import { writable } from 'svelte/store';

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
	/* .quoteimgwrapper {
		display: flex;
		justify-content: space-around;
		gap: 2rem;
	}

	.quote {
		min-width: 50%;
		padding: 1rem;
	}

	.rehaanimg {
		max-width: 450px;
		height: auto;
		border-radius: 20px;
		display: block;
	}

	@media (max-width: 900px) {
		.rehaanimg {
			max-width: 80px;
		}
	}

	@media (max-width: 600px) {
		.rehaanimg {
			max-width: 60px;
		}
	} */

.quoteimgwrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Text styling */
.quoteimgwrapper .abt-txt {
  max-width: 500px;
}

/* Image styling */
.quoteimgwrapper .rehaanimg {
  max-width: 200px;
  height: auto;
  border-radius: 10%;
}

/* For tablets and below */
@media (max-width: 768px) {
  .quoteimgwrapper {
    flex-direction: column;
    text-align: center;
  }
  .quoteimgwrapper .abt-txt {
    font-size: 1.25rem; /* smaller text */
    max-width: 90%;
  }
  .quoteimgwrapper .rehaanimg {
    max-width: 120px;
  }
}

/* For small phones */
@media (max-width: 480px) {
  .quoteimgwrapper .abt-txt {
    font-size: 1rem;
  }
  .quoteimgwrapper .rehaanimg {
    max-width: 100px;
  }
}
	.rehaanimg {
		transition: all 0.3s ease-in-out;
	}

	.rehaanimg:hover {
		transform: scale(1.02);
		transition: all ease-in-out 0.2s;
		box-shadow:white;
	}
  
  </style>

<!-- 
<style>
	/* .quoteimgwrapper {
		display: flex;
		justify-content: space-around;
		gap: 2rem;
	}

	.quote {
		min-width: 50%;
		padding: 1rem;
	}

	.rehaanimg {
		max-width: 450px;
		height: auto;
		border-radius: 20px;
		display: block;
	}

	@media (max-width: 900px) {
		.rehaanimg {
			max-width: 80px;
		}
	}

	@media (max-width: 600px) {
		.rehaanimg {
			max-width: 60px;
		}
	} */

.quoteimgwrapper {
  display: flex;
  align-items: center;
  gap: 1rem;
}

/* Text styling */
.quoteimgwrapper .abt-txt {
  max-width: 500px;
}

/* Image styling */
.quoteimgwrapper .rehaanimg {
  max-width: 200px;
  height: auto;
  border-radius: 10%;
}

/* For tablets and below */
@media (max-width: 768px) {
  .quoteimgwrapper {
    flex-direction: column;
    text-align: center;
  }
  .quoteimgwrapper .abt-txt {
    font-size: 1.25rem; /* smaller text */
    max-width: 90%;
  }
  .quoteimgwrapper .rehaanimg {
    max-width: 120px;
  }
}

/* For small phones */
@media (max-width: 480px) {
  .quoteimgwrapper .abt-txt {
    font-size: 1rem;
  }
  .quoteimgwrapper .rehaanimg {
    max-width: 100px;
  }
}
	.rehaanimg {
		transition: all 0.3s ease-in-out;
	}

	.rehaanimg:hover {
		transform: scale(1.02);
		transition: all ease-in-out 0.2s;
		box-shadow:white;
	}
  
  </style> -->

{#if $ready}

	<Section name="testimonial">
		<Testimonial Icon={Quotes}>
			<div class="quoteimgwrapper">
				<!-- <blockquote class="quote"> -->
					<p class="abt-txt text-2xl font-medium text-gray-300">
						{displayedInfo}
					</p>
				<!-- </blockquote> -->
         <a href="https://www.linkedin.com/in/rehaananjaria/" target="_blank">
          <div class="imgwrapper">
				    <img class="rehaanimg" src="https://firebasestorage.googleapis.com/v0/b/droneworks-14880.appspot.com/o/goodpfp.png?alt=media&token=d203dde8-d9ac-4101-a96f-0bacad845d0f" alt="RehaanAnjaria">
          </div>
        </a>
			</div>
			
			<!-- {#snippet footer()}
				<img class="h-6 w-6 rounded-full" src="https://firebasestorage.googleapis.com/v0/b/droneworks-14880.appspot.com/o/goodpfp.png?alt=media&token=d203dde8-d9ac-4101-a96f-0bacad845d0f" alt="michael profile" />
				<div class="flex items-center divide-x-2 divide-gray-500 dark:divide-gray-700">
					<div class="pr-3 font-medium text-gray-900 dark:text-white">Rehaan Anjaria</div>
				</div>
			{/snippet} -->
		</Testimonial>
	</Section>

{/if}