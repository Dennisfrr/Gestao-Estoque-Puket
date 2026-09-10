import type { ReactNode } from "react";
import { AlertOctagon } from "lucide-react";

export function ErrorState({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-destructive/30 bg-destructive-soft px-6 py-10 text-center"
    >
      <span className="grid h-14 w-14 place-items-center rounded-full bg-card text-destructive">
        <AlertOctagon className="h-7 w-7" aria-hidden="true" />
      </span>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      {actions}
    </div>
  );
}
