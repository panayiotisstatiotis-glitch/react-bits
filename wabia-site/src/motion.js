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

// A section title whose letters rise out of masks as it scrolls in. The split waits until the title is half a screen
// away: splitting re-lays out the page, so loading doesn't pay for titles far below. Call inside useGSAP.
export const riseTitle = (selector, start, stagger, contextSafe) =>
  ScrollTrigger.create({
    trigger: selector,
    start: 'top 150%',
    once: true,
    onEnter: contextSafe(() => {
      const { chars } = SplitText.create(selector, { type: 'words,chars', mask: 'chars' });
      gsap.from(chars, {
        yPercent: 118,
        stagger,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: { trigger: selector, start, once: true }
      });
    })
  });
