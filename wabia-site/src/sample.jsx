import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource-variable/anybody/wdth.css';
import '@fontsource-variable/martian-mono/wdth.css';
import './styles.css';
import SampleSite from './SampleSite.jsx';

// sample.html: its own small entry, without the Wabia site's scroll scenes, so it loads fast on a phone.
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SampleSite />
  </StrictMode>
);
