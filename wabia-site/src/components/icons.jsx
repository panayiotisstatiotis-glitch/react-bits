const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };

export const LogoMark = props => (
  <svg viewBox="0 0 32 32" aria-hidden="true" {...props}>
    <rect width="32" height="32" rx="8" />
    <path
      d="M6.5 9.5 10.6 23 16 13.2 21.4 23 25.5 9.5"
      fill="none"
      strokeWidth="3.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Arrow = props => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true" {...stroke} strokeWidth="2.2" {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const Check = props => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true" {...stroke} strokeWidth="2.4" {...props}>
    <path d="m5 12.5 4.2 4.2L19 7" />
  </svg>
);

export const Alert = props => (
  <svg viewBox="0 0 24 24" width="1.1em" height="1.1em" aria-hidden="true" {...stroke} strokeWidth="2" {...props}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M12 7.5v5.5M12 16.5v.01" />
  </svg>
);

export const Snow = props => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} strokeWidth="2" {...props}>
    <path d="M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5" />
  </svg>
);

export const Wave = props => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...stroke} strokeWidth="2" {...props}>
    <path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 15.5c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
  </svg>
);

export const HouseDrawing = props => (
  <svg viewBox="0 0 120 90" aria-hidden="true" {...stroke} strokeWidth="1.4" {...props}>
    <path d="M12 44 60 13l48 31M22 38v42h76V38M52 80V57h16v23M8 80h104" />
    <rect x="30" y="49" width="13" height="13" />
    <rect x="77" y="49" width="13" height="13" />
    <path
      d="M36.5 49v13M30 55.5h13M83.5 49v13M77 55.5h13M26 69h9M41 74h7M72 69h6M88 74h7M30 43h8M84 43h7"
      opacity=".55"
    />
  </svg>
);
