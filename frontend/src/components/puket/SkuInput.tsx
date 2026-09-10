import { AlertCircle, ArrowLeftRight, Barcode, Camera, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Operation } from "@/types";
import { skuExamples } from "@/mocks/operations";
import { getIcon, toneClasses } from "./icons";

export type SkuValidity = "empty" | "typing" | "invalid" | "valid";

export function getSkuValidity(value: string): SkuValidity {
  const sku = value.trim();
  if (!sku) return "empty";
  if (/^\d{6,}(_\d{6,})*$/.test(sku)) return "valid";
  if (sku.length < 6) return "typing";
  return "invalid";
}

export function SkuInput({
  operation,
  value,
  onChange,
  onExecute,
  onOpenScanner,
  onChangeOperation,
  inputRef,
  loading = false,
  buttonLabel = "Visualizar produto",
}: {
  operation: Operation;
  value: string;
  onChange: (value: string) => void;
  onExecute: () => void;
  onOpenScanner: () => void;
  onChangeOperation: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  loading?: boolean;
  buttonLabel?: string;
}) {
  const validity = getSkuValidity(value);
  const Icon = getIcon(operation.icon);

  return (
    <section className="surface-card mx-auto w-full max-w-2xl p-6 motion-safe:animate-[pop-in_0.35s_cubic-bezier(0.34,1.56,0.64,1)_both] sm:p-8">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${toneClasses[operation.tone]}`}
        >
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold">{operation.title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{operation.hint}</p>
        </div>
      </div>

      <div className="mt-6">
        <Label htmlFor="sku" className="text-sm font-bold">
          SKU do produto ou kit
        </Label>
        <div className="relative mt-2">
          <Barcode
            className="pointer-events-none absolute top-1/2 left-4 h-6 w-6 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="sku"
            ref={inputRef}
            value={value}
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            aria-invalid={validity === "invalid"}
            aria-describedby="sku-ajuda"
            placeholder="Digite ou escaneie o SKU"
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                onExecute();
              }
            }}
            className={`h-16 rounded-2xl border-2 pr-28 pl-13 font-mono text-lg tracking-wide md:text-xl ${
              validity === "invalid"
                ? "border-destructive bg-destructive-soft"
                : validity === "valid"
                  ? "border-success bg-success-soft"
                  : "border-input bg-secondary/60"
            }`}
          />
          <div className="absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1">
            {validity === "valid" && (
              <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
            )}
            {validity === "invalid" && (
              <AlertCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-11 w-11 rounded-full text-primary hover:bg-primary-soft"
              onClick={onOpenScanner}
              aria-label="Ler SKU pela câmera"
            >
              <Camera className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        <p id="sku-ajuda" className="mt-2 text-sm">
          {validity === "invalid" ? (
            <span className="font-semibold text-destructive">
              Esse SKU parece incompleto. Use somente números (kits usam underline).
            </span>
          ) : validity === "valid" ? (
            <span className="font-semibold text-success-foreground">
              SKU válido — pode executar.
            </span>
          ) : (
            <span className="text-muted-foreground">
              Pressione Enter para executar. Exemplos — Produto:{" "}
              <button
                type="button"
                className="font-mono font-semibold text-primary underline-offset-2 hover:underline"
                onClick={() => onChange(skuExamples.produto)}
              >
                {skuExamples.produto}
              </button>{" "}
              · Kit:{" "}
              <button
                type="button"
                className="font-mono font-semibold text-primary underline-offset-2 hover:underline"
                onClick={() => onChange(skuExamples.kit)}
              >
                {skuExamples.kit}
              </button>
            </span>
          )}
        </p>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3">
        <Button
          size="lg"
          className="h-14 w-full rounded-full text-base font-bold"
          onClick={onExecute}
          disabled={validity !== "valid" || loading}
        >
          <Play className="h-5 w-5" aria-hidden="true" />
          {loading ? "Buscando produto..." : buttonLabel}
        </Button>
        <button
          type="button"
          onClick={onChangeOperation}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-primary"
        >
          <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
          Trocar operação
        </button>
      </div>
    </section>
  );
}
