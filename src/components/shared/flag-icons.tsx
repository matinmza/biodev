import { cn } from "@/lib/utils";

interface FlagProps {
  className?: string;
}

/** Union Jack, drawn to spec on a 60×30 field. */
export function FlagGB({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <clipPath id="flag-gb-diagonals">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <path d="M0,0 h60 v30 H0 z" fill="#012169" />
      <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFF" strokeWidth="6" />
      <path
        d="M0,0 L60,30 M60,0 L0,30"
        clipPath="url(#flag-gb-diagonals)"
        stroke="#C8102E"
        strokeWidth="4"
      />
      <path d="M30,0 v30 M0,15 h60" stroke="#FFF" strokeWidth="10" />
      <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  );
}

/** Flag of Iran: green / white / red tricolour with the centre emblem. */
export function FlagIR({ className }: FlagProps) {
  return (
    <svg
      viewBox="0 0 60 30"
      className={cn("h-full w-full", className)}
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M0,0 h60 v10 H0 z" fill="#239F40" />
      <path d="M0,10 h60 v10 H0 z" fill="#FFF" />
      <path d="M0,20 h60 v10 H0 z" fill="#DA0000" />
      {/* Emblem, simplified for small sizes: sword flanked by four crescents. */}
      <g fill="#DA0000" transform="translate(30 15)">
        <path d="M-0.9,-3.4 h1.8 v4.6 a0.9 0.9 0 0 1 -1.8 0 z" />
        <path d="M-3.1,-1.9 q-1.1 1.5 0 3 q-1.9 -1.5 0 -3 z" />
        <path d="M3.1,-1.9 q1.1 1.5 0 3 q1.9 -1.5 0 -3 z" />
        <path d="M-1.9,-1.2 q-0.8 1.6 0.5 2.7 q-1.5 -1.3 -0.5 -2.7 z" />
        <path d="M1.9,-1.2 q0.8 1.6 -0.5 2.7 q1.5 -1.3 0.5 -2.7 z" />
        <path d="M-2.4,1.6 h4.8 v0.7 h-4.8 z" />
      </g>
    </svg>
  );
}
