import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect } from 'react';
import Header from './components/Header.jsx';
import Hero from './components/Hero.jsx';
import Marquee from './components/Marquee.jsx';
import Statement from './components/Statement.jsx';
import Work from './components/Work.jsx';
import Process from './components/Process.jsx';
import Pricing from './components/Pricing.jsx';
import Quote from './components/Quote.jsx';
import Footer from './components/Footer.jsx';

// Read once at load. With reduced motion there is no Lenis at all: native scrolling, instant jumps, no scroll effects.
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) document.documentElement.classList.add('motion');

const easeOutExpo = t => (t === 1 ? 1 : 1 - 2 ** (-10 * t));

function Page() {
  const lenis = useLenis();

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
      if (lenis) lenis.scrollTo(target, { duration: 1.2, easing: easeOutExpo });
      else target.scrollIntoView();
      target.focus({ preventScroll: true });
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [lenis]);

  // Reveal blocks once as they enter the viewport. Skipped with reduced motion, where everything is visible already.
  useEffect(() => {
    if (reduceMotion) return;
    const io = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute('data-in', '');
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    document.querySelectorAll('[data-reveal]').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <Marquee />
        <Statement />
        <Work />
        <Process />
        <Pricing />
        <Quote />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return reduceMotion ? (
    <Page />
  ) : (
    <ReactLenis root>
      <Page />
    </ReactLenis>
  );
}
