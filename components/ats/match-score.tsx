"use client";

function scoreColor(score: number): string {
  if (score >= 75) return "#0F766E";
  if (score >= 50) return "#C2552E";
  return "#B91C1C";
}

export function MatchScore({ score }: { score: number }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = scoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <svg width={140} height={140} viewBox="0 0 140 140" role="img" aria-label={`ATS match score ${score} percent`}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke="#e5e5e5" strokeWidth={12} />
        <circle
          cx={70}
          cy={70}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={12}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ transition: "stroke-dashoffset 700ms ease" }}
        />
        <text x={70} y={66} textAnchor="middle" fontSize={30} fontWeight={700} fill="#1a1a1a">
          {score}
        </text>
        <text x={70} y={88} textAnchor="middle" fontSize={11} fill="#888">
          / 100
        </text>
      </svg>
      <p className="mt-1 text-sm font-medium" style={{ color }}>
        {score >= 75 ? "Strong match" : score >= 50 ? "Partial match" : "Weak match"}
      </p>
    </div>
  );
}
