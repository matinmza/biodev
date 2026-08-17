import {
  BarChart3,
  Bot,
  Dumbbell,
  Globe,
  Plane,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  type LucideIcon,
} from "lucide-react";
import { getProject, type ProjectId } from "@/data/projects";
import { cn } from "@/lib/utils";

const ICONS: Record<ProjectId, LucideIcon> = {
  "hiweb-ai": Bot,
  "selfit-coach": Dumbbell,
  "selfit-app": Smartphone,
  "selfit-b2b": BarChart3,
  seltrip: Plane,
  esim: Globe,
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
        "flex items-center justify-center rounded-[24%] shadow-lg shadow-black/20",
        className
      )}
    >
      <Icon className={cn("h-1/2 w-1/2 text-white", iconClassName)} strokeWidth={1.8} />
    </div>
  );
}
