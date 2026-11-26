import Magnet from '../bits/Magnet.jsx';
import TextPressure from '../bits/TextPressure.jsx';
import { finePointer, reduceMotion } from '../motion.js';
import { Arrow } from './icons.jsx';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__cta" data-reveal>
        <p className="footer__big">Ready when you are.</p>
        <Magnet disabled={!finePointer || reduceMotion} padding={60} magnetStrength={3}>
          <a className="btn btn--lime btn--lg" href="#quote" data-cursor-label="Quote">
            Request a quote <Arrow className="btn__arrow" />
          </a>
        </Magnet>
      </div>
      {/* The wordmark bulges wider and heavier near the cursor (or a finger), and ripples on its own when idle. */}
      <div className="footer__mark">
        <TextPressure
          text="WABIA"
          fontFamily="'Anybody Variable', sans-serif"
          fontUrl=""
          italic={false}
          idle="wave"
          idleSpeed={0.6}
          radius={0.45}
          minFontSize={56}
        />
      </div>
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
        <p className="footer__legal mono">© {new Date().getFullYear()} Wabia · Concept designs shown are fictional</p>
      </div>
    </footer>
  );
}
