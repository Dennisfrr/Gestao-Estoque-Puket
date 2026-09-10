import type { Operation, OperationId } from "@/types";
import { operations } from "@/mocks/operations";
import { OperationCard } from "./OperationCard";

export function OperationSelector({
  selectedId,
  onSelect,
}: {
  selectedId: OperationId | null;
  onSelect: (operation: Operation) => void;
}) {
  return (
    <section aria-labelledby="operacoes-titulo">
      <h2 id="operacoes-titulo" className="sr-only">
        Operações disponíveis
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {operations.map((operation) => (
          <OperationCard
            key={operation.id}
            operation={operation}
            selected={selectedId === operation.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
