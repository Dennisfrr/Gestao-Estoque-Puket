import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import type { HistoryEntry } from "@/types";
import { operationById } from "@/mocks/operations";
import { ProgressStep } from "./ProgressStep";
import { HistoryStatusPill } from "./StatusPill";
import { formatDateTime } from "@/lib/format";

export function HistoryDetails({
  entry,
  onOpenChange,
}: {
  entry: HistoryEntry | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Sheet open={Boolean(entry)} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        {entry && (
          <>
            <SheetHeader>
              <SheetTitle className="font-display">{entry.product}</SheetTitle>
              <SheetDescription>
                SKU <span className="font-mono">{entry.sku}</span>
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-8">
              <HistoryStatusPill status={entry.status} />

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Operação</dt>
                  <dd className="font-bold">{operationById(entry.operation).title}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Duração</dt>
                  <dd className="font-bold">{entry.duration}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Usuário</dt>
                  <dd className="font-bold">{entry.user}</dd>
                </div>
                <div>
                  <dt className="text-xs font-semibold text-muted-foreground">Data e hora</dt>
                  <dd className="font-bold">{formatDateTime(entry.dateTime)}</dd>
                </div>
              </dl>

              <p className="rounded-2xl bg-secondary/60 p-4 text-sm text-muted-foreground">
                {entry.summary}
              </p>

              <div>
                <h3 className="mb-2 font-display text-base font-bold">Etapas</h3>
                <ol className="space-y-1">
                  {entry.steps.map((step, index) => (
                    <ProgressStep
                      key={`${step.label}-${index}`}
                      label={step.label}
                      detail={step.detail}
                      state={step.state}
                    />
                  ))}
                </ol>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
