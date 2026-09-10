import { AlertTriangle, Check, Circle, Loader2, XCircle } from "lucide-react";
import type { StepState } from "@/types";

const config: Record<
  StepState,
  { label: string; className: string; icon: typeof Check; text: string }
> = {
  waiting: {
    label: "Aguardando",
    className: "bg-secondary text-muted-foreground",
    icon: Circle,
    text: "text-muted-foreground",
  },
  running: {
    label: "Em andamento",
    className: "bg-info-soft text-info-foreground",
    icon: Loader2,
    text: "text-info-foreground",
  },
  done: {
    label: "Concluída",
    className: "bg-success-soft text-success-foreground",
    icon: Check,
    text: "text-foreground",
  },
  warning: {
    label: "Aviso",
    className: "bg-warning-soft text-warning-foreground",
    icon: AlertTriangle,
    text: "text-warning-foreground",
  },
  error: {
    label: "Erro",
    className: "bg-destructive-soft text-destructive",
    icon: XCircle,
    text: "text-destructive",
  },
};

export function ProgressStep({
  label,
  detail,
  state,
}: {
  label: string;
  detail: string;
  state: StepState;
}) {
  const item = config[state];
  const Icon = item.icon;

  return (
    <li className="flex min-w-0 items-start gap-3 rounded-2xl px-2 py-2">
      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${item.className}`}>
        <Icon
          className={`h-4.5 w-4.5 ${state === "running" ? "motion-safe:animate-spin" : ""}`}
          aria-hidden="true"
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block text-sm font-bold ${item.text}`}>{label}</span>
        <span className="block text-xs text-muted-foreground">{detail}</span>
      </span>
      <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-[11px] font-bold text-secondary-foreground">
        {item.label}
      </span>
    </li>
  );
}
