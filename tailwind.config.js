import flowbite from 'flowbite/plugin';
import daisyui from 'daisyui';
<<<<<<< HEAD
<<<<<<< HEAD
import animate from 'tailwindcss-animate';
=======
>>>>>>> 7d333a6 (basic implementation and boilerplate with components done)
=======
import animate from 'tailwindcss-animate';
>>>>>>> 7ad9d1e (nav about projects and skills all done.)

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
		'./src/components/**/*.{html,js,svelte,ts}'
	],
	theme: {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 7ad9d1e (nav about projects and skills all done.)
		extend: {
			keyframes: {
              'marquee-left': {
                  from: { transform: 'translateX(0)' },
                  to: { transform: 'translateX(calc(-100% - var(--gap)))' }
              },
              'marquee-up': {
                  from: { transform: 'translateY(0)' },
                  to: { transform: 'translateY(calc(-100% - var(--gap)))' }
              }
          },
          animation: {
              'marquee-left': 'marquee-left var(--duration, 40s) linear infinite',
              'marquee-up': 'marquee-up var(--duration, 40s) linear infinite'
          }
		}
<<<<<<< HEAD
	},
	plugins: [
		flowbite,
		daisyui,
		animate
		// require("flowbite-typography")
	]
};
=======
		extend: {}
	},
plugins: [
	flowbite,
	daisyui
<<<<<<< HEAD
	// require("flowbite-typ
>>>>>>> 7d333a6 (basic implementation and boilerplate with components done)
=======
	// require("flowbite-typography")
]
};
>>>>>>> b9ad6e7 (all admin crud complete)
=======
	},
	plugins: [
		flowbite,
		daisyui,
		animate
		// require("flowbite-typography")
	]
};
>>>>>>> 7ad9d1e (nav about projects and skills all done.)
