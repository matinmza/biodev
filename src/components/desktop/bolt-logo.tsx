import { cn } from "@/lib/utils";

/** The MatinOS bolt mark — the one accent gradient in the system. */
export default function BoltLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 256"
      className={cn("h-5 w-5", className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bolt-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00CCFF" />
          <stop offset="100%" stopColor="#8866FF" />
        </linearGradient>
      </defs>
      <path
        d="M113.14 26.767c4.175-6.958 14.86-3.998 14.86 4.116v50.784a7 7 0 007 7h78.87c6.219 0 10.06 6.783 6.86 12.116l-77.87 129.784c-4.175 6.957-14.86 3.998-14.86-4.116v-50.784a7 7 0 00-7-7H42.13c-6.219 0-10.06-6.784-6.86-12.116z"
        fill="url(#bolt-gradient)"
      />
    </svg>
  );
}
