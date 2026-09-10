import { CircleAlert, Cloud, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { checkHealth } from "@/lib/api";

export function DemoModeBadge({ className = "" }: { className?: string }) {
  const [state, setState] = useState<"checking" | "online" | "offline">("checking");
  useEffect(() => { checkHealth().then(() => setState("online"), () => setState("offline")); }, []);
  const Icon = state === "checking" ? LoaderCircle : state === "online" ? Cloud : CircleAlert;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${state === "online" ? "border-success/40 bg-success-soft text-success-foreground" : state === "offline" ? "border-destructive/40 bg-destructive-soft text-destructive" : "border-info/40 bg-info-soft text-info-foreground"} ${className}`}
    >
      <Icon className={`h-3.5 w-3.5 ${state === "checking" ? "animate-spin" : ""}`} aria-hidden="true" />
      {state === "checking" ? "Conectando" : state === "online" ? "Backend conectado" : "Backend offline"}
    </span>
  );
}
