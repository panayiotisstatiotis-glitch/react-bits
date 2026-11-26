import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useRef } from 'react';
import { finePointer, gsap, reduceMotion, ScrollTrigger, useGSAP } from './motion.js';
import ClickSpark from './bits/ClickSpark.jsx';
import TargetCursor from './bits/TargetCursor.jsx';
import Header from './components/Header.jsx';
import Ruler from './components/Ruler.jsx';
import Hero from './components/Hero.jsx';
import Tapes from './components/Tapes.jsx';
import Statement from './components/Statement.jsx';
import Work from './components/Work.jsx';
import Process from './components/Process.jsx';
import Pricing from './components/Pricing.jsx';
import Quote from './components/Quote.jsx';
import Footer from './components/Footer.jsx';

const easeOutExpo = t => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

function Page({ home }) {
  // Lenis smooths the scroll; ScrollTrigger reads the smoothed position on every Lenis frame.
  const lenis = useLenis(ScrollTrigger.update);

  // Same-page links: Lenis scrolls to the target (it honours the CSS scroll-padding that clears the sticky header),
  // then the URL and keyboard focus follow, like a native anchor jump.
  useEffect(() => {
    const onClick = e => {
      const link = e.target.closest('a[href^="#"]');
      if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = document.getElementById(link.hash.slice(1));
      if (!target) return;
      e.preventDefault();
      history.pushState(null, '', link.hash);
      if (lenis) lenis.scrollTo(target, { duration: 1.4, easing: easeOutExpo });
      else target.scrollIntoView();
      target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  // Deep links (a shared /#pricing, or a reload after a menu jump): the page renders after the browser's own jump
  // to the hash, so jump once the section exists.
  useEffect(() => {
    const target = location.hash && document.getElementById(location.hash.slice(1));
    if (!target) return;
    if (lenis) lenis.scrollTo(target, { immediate: true });
    else if (reduceMotion) target.scrollIntoView();
  }, [lenis]);

  // Blocks marked data-reveal rise in once as they enter, in small staggered batches.
  useGSAP(() => {
    if (reduceMotion) return;
    // Skip blocks that are display: none at this size: GSAP forces a page layout for each, and leaving them alone means
    // they simply show if a resize brings them in.
    const blocks = gsap.utils.toArray('[data-reveal]').filter(el => el.checkVisibility?.() ?? true);
    gsap.set(blocks, { autoAlpha: 0, y: 48 });
    ScrollTrigger.batch(blocks, {
      start: 'top 88%',
      once: true,
      onEnter: batch => gsap.to(batch, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.09 })
    });
    // Fonts change line lengths, so measure again once they're in.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
  });

  return (
    <ClickSpark sparkColor="#b8f23d" sparkCount={10} sparkRadius={34} sparkSize={12} duration={520}>
      {finePointer && !reduceMotion && (
        <TargetCursor
          targetSelector="a, button, .ticket, [data-cursor-label]"
          cursorColor="#b8f23d"
          blendMode="normal"
          size={30}
          cornerSize={11}
          thickness={2.5}
          padding={7}
          spinDuration={3}
        />
      )}
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header home={home} />
      <Ruler />
      <main id="main" tabIndex={-1}>
        {home ? (
          <>
            <Hero />
            <Tapes />
            <Statement />
            <Work />
            <Process />
            <Pricing />
          </>
        ) : (
          <Quote />
        )}
      </main>
      <Footer home={home} />
    </ClickSpark>
  );
}

// page: 'quote' for quote.html, anything else is the home page.
export default function App({ page }) {
  const home = page !== 'quote';
  const lenisRef = useRef(null);

  // GSAP's ticker drives Lenis, so smooth scrolling and every scroll animation share one frame clock.
  useEffect(() => {
    if (reduceMotion) return;
    const update = time => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    return () => gsap.ticker.remove(update);
  }, []);

  return reduceMotion ? (
    <Page home={home} />
  ) : (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.09 }}>
      <Page home={home} />
    </ReactLenis>
  );
}
