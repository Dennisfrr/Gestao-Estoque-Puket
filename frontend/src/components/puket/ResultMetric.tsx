import type { ResultMetricData } from "@/types";
import { getIcon, toneClasses } from "./icons";

export function ResultMetric({ metric }: { metric: ResultMetricData }) {
  const Icon = getIcon(metric.icon);
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <span
        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${toneClasses[metric.tone]}`}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block truncate text-xs font-semibold text-muted-foreground">
          {metric.label}
        </span>
        <span className="block font-display text-lg font-bold">{metric.value}</span>
      </span>
    </div>
  );
}
