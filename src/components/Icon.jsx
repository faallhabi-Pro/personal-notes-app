import React from 'react';

const paths = {
  plus: 'M12 5v14M5 12h14',
  check: 'M5 13l4 4L19 7',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  archive: 'M3 5h18v4H3zM5 9v10h14V9M10 13h4',
  unarchive: 'M3 5h18v4H3zM5 9v10h14V9M12 17v-6M9 14l3-3 3 3',
  sun: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  translate: 'M4 5h8M8 3v2M6 5c0 4 3 7 6 8M12 5c0 4-3 7-6 8M13 21l4-10 4 10M14.5 18h5',
  logout: 'M9 4H5v16h4M16 8l4 4-4 4M20 12H9',
};

function Icon({ name }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  );
}

export default Icon;
