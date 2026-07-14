import timeline from '../content/timeline.json';

export const prerender = true;

export function load() {
	return { timeline };
}
