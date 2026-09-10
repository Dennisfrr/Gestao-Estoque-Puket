import type { IntegrationStatus } from "@/types";
import { getIcon } from "./icons";
import { IntegrationStatusPill } from "./StatusPill";

export function IntegrationStatusCard({ integration }: { integration: IntegrationStatus }) {
  const Icon = getIcon(integration.icon);
  return (
    <article className="surface-card flex min-w-0 flex-col gap-3 p-5">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-5.5 w-5.5" aria-hidden="true" />
        </span>
        <h3 className="truncate font-display text-lg font-bold">{integration.name}</h3>
      </div>
      <IntegrationStatusPill state={integration.state} />
      <p className="text-sm text-muted-foreground">{integration.description}</p>
      <p className="text-xs font-semibold text-muted-foreground">
        Última verificação: {integration.lastCheck}
      </p>
    </article>
  );
}
