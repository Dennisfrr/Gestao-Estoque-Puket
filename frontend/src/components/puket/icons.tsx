import {
  BookOpen,
  Boxes,
  Database,
  Gift,
  Grid2x2,
  Grid2x2Plus,
  Image,
  PackageSearch,
  PackagePlus,
  RefreshCw,
  SearchCheck,
  Server,
  Shirt,
  Sparkles,
  Timer,
  type LucideIcon,
} from "lucide-react";

const registry: Record<string, LucideIcon> = {
  BookOpen,
  Boxes,
  Database,
  Gift,
  Grid2x2,
  Grid2x2Plus,
  Image,
  PackageSearch,
  PackagePlus,
  RefreshCw,
  SearchCheck,
  Server,
  Shirt,
  Sparkles,
  Timer,
};

export function getIcon(name: string): LucideIcon {
  return registry[name] ?? Sparkles;
}

export const toneClasses: Record<string, string> = {
  primary: "bg-primary-soft text-primary",
  accent: "bg-accent-soft text-accent-foreground",
  info: "bg-info-soft text-info-foreground",
  grape: "bg-grape-soft text-grape",
  success: "bg-success-soft text-success-foreground",
};
