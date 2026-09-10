import { Check } from "lucide-react";
import type { Operation } from "@/types";
import { getIcon, toneClasses } from "./icons";

export function OperationCard({
  operation,
  selected,
  onSelect,
}: {
  operation: Operation;
  selected: boolean;
  onSelect: (operation: Operation) => void;
}) {
  const Icon = getIcon(operation.icon);

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect(operation)}
      className={`group relative flex h-full w-full flex-col items-start gap-3 rounded-3xl border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-float)] ${
        selected
          ? "border-primary bg-primary-soft shadow-[var(--shadow-float)]"
          : "border-border bg-card shadow-[var(--shadow-soft)]"
      }`}
    >
      <span
        className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${toneClasses[operation.tone]}`}
      >
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="block font-display text-base font-bold">{operation.title}</span>
        <span className="mt-1 block text-sm text-muted-foreground">{operation.description}</span>
      </span>
      <span
        className={`absolute top-4 right-4 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold transition-opacity ${
          selected ? "bg-primary text-primary-foreground opacity-100" : "opacity-0"
        }`}
      >
        <Check className="h-3 w-3" aria-hidden="true" />
        Selecionada
      </span>
    </button>
  );
}
