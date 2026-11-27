import { DrosiaPage } from './components/Concepts.jsx';
import { useDrosiaDemo } from './components/drosia-demo.jsx';

// A sample website a tradesperson can open on their own phone: the air-con concept at full size, with the same
// Call now / Get a quote journeys their customers would take. Fictional, and it says so before anything else.
export default function SampleSite() {
  const { bar, screen } = useDrosiaDemo();
  return (
    <>
      <header className="sample__banner">
        <p>
          <strong>Sample website by Wabia.</strong> Drosia Air-Con is a made-up business, so nothing you send here goes
          anywhere.
        </p>
        <a href="./">Back to Wabia</a>
      </header>
      <main className="phone phone--dark sample">
        <div className="phone__screen sample__screen">
          <div className="phone__page">
            <DrosiaPage />
          </div>
          <div className="phone__bar">{bar}</div>
          {screen}
        </div>
      </main>
    </>
  );
}
