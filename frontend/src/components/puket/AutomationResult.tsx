import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCopy,
  Eye,
  PartyPopper,
  RotateCcw,
  Search,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { AutomationResultData, Operation, ResultKind } from "@/types";
import { demoResult, errorResult, successMetrics, warningResult } from "@/mocks/automation";
import { ResultMetric } from "./ResultMetric";

export function AutomationResult({
  kind,
  operation,
  sku,
  onRestart,
  onRetry,
  onFixSku,
  result,
  error,
}: {
  kind: ResultKind;
  operation: Operation;
  sku: string;
  onRestart: () => void;
  onRetry: () => void;
  onFixSku: () => void;
  result?: AutomationResultData | null;
  error?: { message: string; step: string } | null;
}) {
  const shell =
    "surface-card mx-auto w-full max-w-2xl p-6 sm:p-8 motion-safe:animate-[pop-in_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both]";

  if (kind === "success") {
    return (
      <section className={shell}>
        <div className="flex flex-col items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-success-soft text-success-foreground">
            <PartyPopper className="h-8 w-8" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold">Tudo pronto!</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            O produto foi processado com sucesso.
          </p>
          <p className="mt-3 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold">
            SKU <span className="font-mono">{sku || demoResult.sku}</span> · {result?.product || demoResult.product}
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {(result ? [
            { ...successMetrics[0]!, value: result.existing ? "Localizado" : "Criado" },
            { ...successMetrics[1]!, value: String(result.variations) },
            { ...successMetrics[2]!, value: String(result.created) },
            { ...successMetrics[3]!, value: String(result.stockUpdated) },
            { ...successMetrics[4]!, value: String(result.images) },
          ] : successMetrics).map((metric) => (
            <ResultMetric key={metric.id} metric={metric} />
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button className="h-12 flex-1 rounded-full font-bold" onClick={onRestart}>
            Executar outra operação
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-full"
            onClick={() => toast.info("Detalhes demonstrativos da operação", { description: operation.title })}
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Ver detalhes
          </Button>
          <Button
            variant="ghost"
            className="h-12 flex-1 rounded-full"
            onClick={() => toast.success("Relatório copiado (demonstração)")}
          >
            <ClipboardCopy className="h-4 w-4" aria-hidden="true" />
            Copiar relatório
          </Button>
        </div>
      </section>
    );
  }

  if (kind === "warning") {
    return (
      <section className={shell}>
        <div className="flex flex-col items-center text-center">
          <span className="grid h-16 w-16 place-items-center rounded-full bg-warning-soft text-warning-foreground">
            <AlertTriangle className="h-8 w-8" aria-hidden="true" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-extrabold">{warningResult.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{result?.product || warningResult.message}</p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-success/30 bg-success-soft p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-success-foreground">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" />O que foi concluído
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {(result ? [`${result.variations} variações encontradas`, `${result.created} cadastros criados`, `${result.stockUpdated} saldos atualizados`] : warningResult.done).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-warning/40 bg-warning-soft p-4">
            <h3 className="flex items-center gap-2 text-sm font-bold text-warning-foreground">
              <AlertTriangle className="h-4 w-4" aria-hidden="true" />O que precisa ser revisto
            </h3>
            <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              {(result?.warnings?.length ? result.warnings : warningResult.review).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
            <p className="mt-3 text-sm font-semibold">
              SKU com pendência:{" "}
              <span className="font-mono text-warning-foreground">{result?.parentSku || warningResult.problemSku}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <Button
            className="h-12 flex-1 rounded-full font-bold"
            onClick={() =>
              toast.warning("Pendência da operação", { description: result?.warnings?.[0] || warningResult.review[0] })
            }
          >
            <Eye className="h-4 w-4" aria-hidden="true" />
            Ver pendência
          </Button>
          <Button variant="outline" className="h-12 flex-1 rounded-full" onClick={onRetry}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Executar novamente
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className={shell}>
      <div className="flex flex-col items-center text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-destructive-soft text-destructive">
          <XCircle className="h-8 w-8" aria-hidden="true" />
        </span>
        <h2 className="mt-4 font-display text-2xl font-extrabold">{errorResult.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{error?.message || errorResult.message}</p>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-destructive/25 bg-destructive-soft p-4">
          <p className="text-sm font-bold">Etapa: {error?.step || errorResult.step}</p>
          <p className="mt-1 text-sm text-muted-foreground">{error?.message || errorResult.explanation}</p>
        </div>
        <div className="rounded-2xl border border-border bg-secondary/50 p-4">
          <h3 className="flex items-center gap-2 text-sm font-bold">
            <Search className="h-4 w-4" aria-hidden="true" />O que conferir
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
            {errorResult.suggestions.map((item) => (
              <li key={item}>• {item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button className="h-12 flex-1 rounded-full font-bold" onClick={onFixSku}>
          Corrigir SKU
        </Button>
        <Button variant="outline" className="h-12 flex-1 rounded-full" onClick={onRetry}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Tentar novamente
        </Button>
        <Button variant="ghost" className="h-12 flex-1 rounded-full" onClick={onRestart}>
          Voltar ao início
        </Button>
      </div>
    </section>
  );
}
