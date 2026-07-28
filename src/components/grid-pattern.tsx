import { cn } from "@/lib/utils";

interface GridPatternProps {
  className?: string;
  size?: number;
  strokeDasharray?: string;
  patternType?: "lines" | "dots" | "cross";
}

export function GridPattern({
  className,
  size = 32,
  strokeDasharray,
  patternType = "lines",
}: GridPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]",
        className
      )}
    >
      <svg className="h-full w-full stroke-primary/20 fill-primary/20">
        <defs>
          <pattern
            id={`grid-pattern-${patternType}-${size}`}
            width={size}
            height={size}
            patternUnits="userSpaceOnUse"
            x="-1"
            y="-1"
          >
            {patternType === "lines" && (
              <path
                d={`M.5 ${size}V.5H${size}`}
                fill="none"
                strokeDasharray={strokeDasharray}
              />
            )}
            {patternType === "dots" && (
              <circle cx={size / 2} cy={size / 2} r="1.5" strokeWidth="0" />
            )}
            {patternType === "cross" && (
              <path
                d={`M${size / 2 - 3} ${size / 2}H${size / 2 + 3}M${size / 2} ${size / 2 - 3}V${size / 2 + 3}`}
                fill="none"
                strokeWidth="1"
              />
            )}
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth={0}
          fill={`url(#grid-pattern-${patternType}-${size})`}
        />
      </svg>
    </div>
  );
}
