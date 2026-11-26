const stroke = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round' };
const icon = (d, width = 2) =>
  function Icon(props) {
    return (
      <svg
        viewBox="0 0 24 24"
        width="1.1em"
        height="1.1em"
        aria-hidden="true"
        {...stroke}
        strokeWidth={width}
        {...props}
      >
        <path d={d} />
      </svg>
    );
  };

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

export const Arrow = icon('M5 12h14M13 6l6 6-6 6', 2.2);
export const Check = icon('m5 12.5 4.2 4.2L19 7', 2.4);
export const Alert = icon('M12 2.5a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19zM12 7.5v5.5M12 16.5v.01');
export const Snow = icon('M12 2.5v19M3.8 7.25l16.4 9.5M3.8 16.75l16.4-9.5M9 4.5l3 2.5 3-2.5M9 19.5l3-2.5 3 2.5');
export const Wave = icon(
  'M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2M2 15.5c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2'
);
export const Wrench = icon('M14.5 5.5a4 4 0 0 0 4.9 4.9l-9 9a2.1 2.1 0 0 1-3-3l9-9a4 4 0 0 0-1.9-1.9z');
export const Gauge = icon('M4 15a8 8 0 1 1 16 0M12 15l4-5M7 15h.01M17 15h.01');
export const Building = icon(
  'M4 21V5l8-2v18M12 9l8 2v10M2.5 21h19M7.5 8v.01M7.5 12v.01M7.5 16v.01M15.5 14v.01M15.5 17v.01'
);
export const Phone = icon(
  'M6.6 3.5h2.6l1.3 4.2-1.9 1.3a12 12 0 0 0 6.4 6.4l1.3-1.9 4.2 1.3v2.6a2.3 2.3 0 0 1-2.5 2.3A17.2 17.2 0 0 1 4.3 6a2.3 2.3 0 0 1 2.3-2.5z'
);
export const Chat = icon('M4 18.5V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H8.5zM8.5 9.5h7M8.5 12.5h4.5');
export const Doc = icon('M7 3h7l4 4v14H7zM14 3v4h4M10 12h5M10 15.5h5');
export const Search = icon('M10.5 4a6.5 6.5 0 1 1 0 13 6.5 6.5 0 0 1 0-13zM15.3 15.3 20 20', 2.2);

// Front elevation of a restored village house, drawn like an architect's sheet.
export const HouseDrawing = props => (
  <svg viewBox="0 0 160 110" aria-hidden="true" {...stroke} strokeWidth="1.2" {...props}>
    <path d="M14 52 80 16l66 36M24 46v52h112V46M8 98h144" />
    <path d="M70 98V70a10 10 0 0 1 20 0v28M84 84h2" />
    <rect x="36" y="58" width="16" height="20" />
    <rect x="108" y="58" width="16" height="20" />
    <path d="M44 58v20M36 68h16M116 58v20M108 68h16M33 81h22M105 81h22" />
    <path
      d="M24 56h12M52 56h18M90 56h18M124 56h12M24 66h12M124 66h12M24 76h12M124 76h12M24 86h46M90 86h46M30 92h16M56 92h10M94 92h14M118 92h12M60 46h40M66 40h28M73 34h14"
      opacity=".45"
    />
    <path d="M8 104h30M8 102v4M38 102v4M23 102v4" opacity=".7" />
  </svg>
);
