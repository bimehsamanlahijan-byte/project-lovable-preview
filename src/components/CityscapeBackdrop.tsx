export function CityscapeBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[78%] overflow-hidden" aria-hidden="true">
      {/* Clouds drifting */}
      <div className="absolute inset-x-0 top-[6%] h-16 cloud-layer opacity-70" />
      <div className="absolute inset-x-0 top-[14%] h-12 cloud-layer-2 opacity-50" />


      {/* City skyline silhouette */}
      <svg className="absolute inset-x-0 bottom-0 w-full h-[70%]" viewBox="0 0 1600 360" preserveAspectRatio="xMidYMax slice" fill="none">
        <defs>
          <linearGradient id="cityGrad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="hsl(220 30% 78%)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="hsl(220 30% 88%)" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        {/* trees + buildings */}
        <g stroke="hsl(220 25% 70%)" strokeWidth="1.4" fill="url(#cityGrad)">
          {/* trees */}
          <g fill="hsl(220 25% 82%)" stroke="hsl(220 25% 68%)">
            <circle cx="60" cy="270" r="22" />
            <rect x="57" y="288" width="6" height="22" />
            <circle cx="1530" cy="270" r="22" />
            <rect x="1527" y="288" width="6" height="22" />
            <circle cx="780" cy="275" r="18" />
            <rect x="777" y="290" width="6" height="20" />
          </g>
          {/* buildings */}
          <rect x="110" y="200" width="70" height="120" rx="2" />
          <rect x="190" y="170" width="55" height="150" rx="2" />
          <rect x="255" y="220" width="80" height="100" rx="2" />
          <rect x="345" y="150" width="60" height="170" rx="2" />
          <rect x="415" y="200" width="90" height="120" rx="2" />
          <rect x="515" y="180" width="50" height="140" rx="2" />
          <rect x="575" y="210" width="70" height="110" rx="2" />
          <rect x="655" y="160" width="80" height="160" rx="2" />
          <rect x="820" y="185" width="65" height="135" rx="2" />
          <rect x="895" y="220" width="85" height="100" rx="2" />
          <rect x="990" y="170" width="55" height="150" rx="2" />
          <rect x="1055" y="200" width="75" height="120" rx="2" />
          <rect x="1140" y="155" width="60" height="165" rx="2" />
          <rect x="1210" y="210" width="90" height="110" rx="2" />
          <rect x="1310" y="180" width="50" height="140" rx="2" />
          <rect x="1370" y="200" width="80" height="120" rx="2" />
          {/* windows */}
          <g fill="hsl(220 30% 92%)" stroke="none">
            {[200,240,280,320,360,400,440,480,520,560,600,640,680,720,840,880,920,960,1000,1040,1080,1160,1200,1240,1280,1320,1380].map((x) => (
              <g key={x}>
                <rect x={x} y="220" width="6" height="8" />
                <rect x={x} y="240" width="6" height="8" />
                <rect x={x} y="260" width="6" height="8" />
              </g>
            ))}
          </g>
        </g>
        {/* ground line */}
        <line x1="0" y1="322" x2="1600" y2="322" stroke="hsl(220 25% 70%)" strokeWidth="1" strokeDasharray="2 4" />
      </svg>


      {/* Pins */}
      <svg className="absolute top-[40%] left-[6%]" width="22" height="28" viewBox="0 0 22 28" fill="hsl(0 75% 60% / 0.5)" stroke="hsl(0 75% 55%)">
        <path d="M11 1 C5 1 1 5 1 11 c0 7 10 16 10 16 s10-9 10-16 c0-6-4-10-10-10z" />
        <circle cx="11" cy="11" r="3.5" fill="white" stroke="none" />
      </svg>
      <svg className="absolute top-[40%] right-[6%]" width="22" height="28" viewBox="0 0 22 28" fill="hsl(0 75% 60% / 0.5)" stroke="hsl(0 75% 55%)">
        <path d="M11 1 C5 1 1 5 1 11 c0 7 10 16 10 16 s10-9 10-16 c0-6-4-10-10-10z" />
        <circle cx="11" cy="11" r="3.5" fill="white" stroke="none" />
      </svg>
    </div>
  );
}

export default CityscapeBackdrop;
