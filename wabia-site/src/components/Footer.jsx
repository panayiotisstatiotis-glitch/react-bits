import { useLenis } from 'lenis/react';
import { useRef } from 'react';
import { progressAt } from '../scroll.js';

export default function Footer() {
  const footerRef = useRef(null);
  const markRef = useRef(null);

  // The wordmark rises into place as the page reaches its end.
  useLenis(() => {
    if (!footerRef.current || !markRef.current) return;
    const p = progressAt(footerRef.current, 1);
    markRef.current.style.transform = `translate3d(0, ${((1 - p) * 45).toFixed(2)}%, 0)`;
  });

  return (
    <footer ref={footerRef} className="footer">
      <div className="wrap footer__grid">
        <p className="footer__about">
          <strong>Wabia</strong> builds fixed-price websites for trades and home service businesses across Cyprus.
        </p>
        <nav aria-label="Footer">
          <ul className="footer__links">
            <li>
              <a href="#work">Work</a>
            </li>
            <li>
              <a href="#process">Process</a>
            </li>
            <li>
              <a href="#pricing">Pricing</a>
            </li>
            <li>
              <a href="#quote">Request a quote</a>
            </li>
            <li>
              <a href="#top">Back to top</a>
            </li>
          </ul>
        </nav>
        <p className="footer__legal">© {new Date().getFullYear()} Wabia. Concept designs shown are fictional.</p>
      </div>
      <div className="footer__mark" aria-hidden="true">
        <span ref={markRef}>wabia</span>
      </div>
    </footer>
  );
}
