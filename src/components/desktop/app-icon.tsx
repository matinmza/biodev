import {
  BarChart3,
  Bot,
  Coffee,
  Dumbbell,
  Globe,
  MessagesSquare,
  Plane,
  Presentation,
  ShieldCheck,
  Smartphone,
  Smile,
  Stethoscope,
  Store,
  type LucideIcon,
} from "lucide-react";
import { getProject, type ProjectId } from "@/data/projects";
import { cn } from "@/lib/utils";

const ICONS: Record<ProjectId, LucideIcon> = {
  "hiweb-ai": Bot,
  "selfit-coach": Dumbbell,
  "selfit-app": Smartphone,
  "selfit-landing": Presentation,
  "selfit-b2b": BarChart3,
  "selfit-provider": Store,
  seltrip: Plane,
  "parsonline-ai": MessagesSquare,
  esim: Globe,
  "rose-menu": Coffee,
  "almas-dental": Smile,
  "farda-insurance": ShieldCheck,
  prodoc: Stethoscope,
};

interface AppIconProps {
  id: ProjectId;
  className?: string;
  iconClassName?: string;
}

/** Squircle app icon rendered from the project's gradient — no image assets. */
export default function AppIcon({ id, className, iconClassName }: AppIconProps) {
  const { gradient } = getProject(id);
  const Icon = ICONS[id];

  return (
    <div
      style={{
        backgroundImage: `linear-gradient(180deg, ${gradient[0]}, ${gradient[1]})`,
      }}
      className={cn(
        "soft-btn flex items-center justify-center rounded-[24%]",
        className
      )}
    >
      <Icon className={cn("h-1/2 w-1/2 text-white", iconClassName)} strokeWidth={1.8} />
    </div>
  );
}
