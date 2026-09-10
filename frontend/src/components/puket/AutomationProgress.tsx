import { Progress } from "@/components/ui/progress";
import type { Operation, ProgressStepData, StepState } from "@/types";
import { ProgressStep } from "./ProgressStep";

export function AutomationProgress({
  operation,
  sku,
  steps,
  states,
  elapsed,
}: {
  operation: Operation;
  sku: string;
  steps: ProgressStepData[];
  states: StepState[];
  elapsed: number;
}) {
  const finished = states.filter((state) => state !== "waiting" && state !== "running").length;
  const percent = Math.round((finished / steps.length) * 100);

  return (
    <section className="surface-card mx-auto w-full max-w-2xl overflow-hidden p-6 sm:p-8">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold">Processando…</h2>
          <p className="mt-1 truncate text-sm text-muted-foreground">
            {operation.title} · SKU <span className="font-mono font-semibold">{sku}</span>
          </p>
        </div>
        <div className="shrink-0 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-bold text-primary tabular-nums">
          {elapsed}s
        </div>
      </div>

      <div className="relative mt-5">
        <Progress value={percent} className="h-3 rounded-full" />
        <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>
            {finished} de {steps.length} etapas
          </span>
          <span>{percent}%</span>
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl bg-primary-soft/60 px-4 py-3">
        <span
          className="absolute -top-3 -right-3 h-14 w-14 rounded-full bg-accent/50 motion-safe:animate-[bubble_7s_ease-in-out_infinite]"
          aria-hidden="true"
        />
        <span
          className="absolute -bottom-4 left-8 h-10 w-10 rounded-full bg-info/40 motion-safe:animate-[bubble_9s_ease-in-out_infinite]"
          aria-hidden="true"
        />
        <p className="relative text-sm font-semibold">Você pode acompanhar cada etapa por aqui</p>
      </div>

      <ol className="mt-4 space-y-1" aria-live="polite">
        {steps.map((step, index) => (
          <ProgressStep
            key={step.id}
            label={step.label}
            detail={step.detail}
            state={states[index] ?? "waiting"}
          />
        ))}
      </ol>
    </section>
  );
}
