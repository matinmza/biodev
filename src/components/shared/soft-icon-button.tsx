import { cn } from "@/lib/utils";

/** Gradient fills that give each control its own material. */
export const SOFT_GRADIENTS = {
  github: "linear-gradient(165deg, #4B5563 0%, #1F2430 100%)",
  linkedin: "linear-gradient(165deg, #3B9BE8 0%, #0A66C2 100%)",
  mail: "linear-gradient(165deg, #22D3EE 0%, #6D5AF5 100%)",
} as const;

interface SoftIconLinkProps {
  href: string;
  label: string;
  gradient: string;
  external?: boolean;
  className?: string;
  children: React.ReactNode;
}

/** A soft, tactile squircle link — the iOS control shape. */
export function SoftIconLink({
  href,
  label,
  gradient,
  external = false,
  className,
  children,
}: SoftIconLinkProps) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      style={{ backgroundImage: gradient }}
      className={cn(
        "soft-btn flex h-7 w-7 items-center justify-center rounded-[32%] text-white",
        className
      )}
    >
      {children}
    </a>
  );
}
