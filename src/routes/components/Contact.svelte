<script lang="ts">
	import { Section } from 'flowbite-svelte-blocks';
	import { Mail } from '@lucide/svelte';
</script>

<style>
	.contact-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 4rem 2rem;
		min-height: 60vh;
	}

	.title-text {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 2rem;
		text-align: center;
		background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		background-clip: text;
	}

	.contact-content {
		backdrop-filter: blur(20px);
		background: rgba(30, 41, 59, 0.4);
		border: 1px solid rgba(148, 163, 184, 0.2);
		border-radius: 20px;
		padding: 3rem;
		box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
		text-align: center;
		max-width: 600px;
		transition: all 0.3s ease;
	}

	.contact-content:hover {
		background: rgba(30, 41, 59, 0.5);
		border-color: rgba(148, 163, 184, 0.4);
		transform: translateY(-5px);
		box-shadow: 0 12px 40px rgba(59, 130, 246, 0.3);
	}

	.email-text {
		font-size: 1.25rem;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 1.5rem;
	}

	.email-link {
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		color: white;
		font-size: 1.5rem;
		font-weight: 600;
		text-decoration: none;
		padding: 1rem 2rem;
		background: rgba(30, 41, 59, 0.4);
		border: 2px solid rgba(148, 163, 184, 0.3);
		border-radius: 12px;
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	}

	.email-link:hover {
		background: rgba(59, 130, 246, 0.2);
		border-color: rgba(59, 130, 246, 0.5);
		transform: translateY(-2px) scale(1.05);
		box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
	}

	@media (max-width: 768px) {
		.title-text {
			font-size: 2rem;
		}
		.contact-content {
			padding: 2rem;
		}
		.email-link {
			font-size: 1.25rem;
			padding: 0.75rem 1.5rem;
		}
	}
</style>

<Section name="contact">
	<div class="contact-wrapper">
		<h2 class="title-text">Contact Me</h2>
		<div class="contact-content">
			<p class="email-text">Let's connect! Send me an email at:</p>
			<a href="mailto:rehaananjaria@gmail.com" class="email-link">
				<Mail class="h-6 w-6" />
				rehaananjaria@gmail.com
			</a>
		</div>
	</div>
</Section>