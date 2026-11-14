/** Staatiline illustratsioon, mis asendab 3D-animatsiooni. Puhtalt dekoratiivne. */
export function StaticDecor() {
  return (
    <svg
      className="decor-static"
      viewBox="0 0 200 200"
      aria-hidden="true"
      focusable="false"
      data-testid="decor-static"
    >
      <defs>
        <linearGradient id="decor-g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7c9cff" />
          <stop offset="1" stopColor="#3b4fd8" />
        </linearGradient>
        <linearGradient id="decor-g2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#5b77f0" />
          <stop offset="1" stopColor="#24308f" />
        </linearGradient>
      </defs>
      {/* Isomeetriline kuup, mis meenutab 3D-kujundit */}
      <polygon points="100,30 160,65 100,100 40,65" fill="#a9bbff" />
      <polygon points="40,65 100,100 100,170 40,135" fill="url(#decor-g1)" />
      <polygon points="160,65 100,100 100,170 160,135" fill="url(#decor-g2)" />
      <circle cx="165" cy="35" r="8" fill="#ffb86b" />
      <circle cx="30" cy="165" r="5" fill="#ffb86b" opacity="0.7" />
    </svg>
  );
}
