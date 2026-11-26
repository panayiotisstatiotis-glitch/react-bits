import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Read once at load. With reduced motion there is no Lenis and no scroll-driven animation: the page is static.
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
// Cursor effects (crosshair, magnet, tilt) only for a real mouse.
export const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (!reduceMotion) document.documentElement.classList.add('motion');

export { gsap, ScrollTrigger, SplitText, useGSAP };
