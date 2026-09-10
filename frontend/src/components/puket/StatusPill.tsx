import { AlertTriangle, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react";
import type { HistoryStatus, IntegrationState } from "@/types";

const historyConfig: Record<
  HistoryStatus,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  concluido: {
    label: "Concluído",
    className: "bg-success-soft text-success-foreground border-success/30",
    icon: CheckCircle2,
  },
  atencao: {
    label: "Concluído com atenção",
    className: "bg-warning-soft text-warning-foreground border-warning/40",
    icon: AlertTriangle,
  },
  erro: {
    label: "Erro",
    className: "bg-destructive-soft text-destructive border-destructive/30",
    icon: XCircle,
  },
  processando: {
    label: "Em processamento",
    className: "bg-info-soft text-info-foreground border-info/40",
    icon: Loader2,
  },
};

export function HistoryStatusPill({ status }: { status: HistoryStatus }) {
  const item = historyConfig[status];
  const Icon = item.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${item.className}`}
    >
      <Icon
        className={`h-3.5 w-3.5 ${status === "processando" ? "motion-safe:animate-spin" : ""}`}
        aria-hidden="true"
      />
      {item.label}
    </span>
  );
}

const integrationConfig: Record<
  IntegrationState,
  { label: string; className: string; icon: typeof CheckCircle2 }
> = {
  operacional: {
    label: "Operacional",
    className: "bg-success-soft text-success-foreground border-success/30",
    icon: CheckCircle2,
  },
  instavel: {
    label: "Instável",
    className: "bg-warning-soft text-warning-foreground border-warning/40",
    icon: AlertTriangle,
  },
  offline: {
    label: "Indisponível",
    className: "bg-destructive-soft text-destructive border-destructive/30",
    icon: XCircle,
  },
  manutencao: {
    label: "Em manutenção",
    className: "bg-info-soft text-info-foreground border-info/40",
    icon: Clock,
  },
};

export function IntegrationStatusPill({ state }: { state: IntegrationState }) {
  const item = integrationConfig[state];
  const Icon = item.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-bold ${item.className}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {item.label}
    </span>
  );
}
