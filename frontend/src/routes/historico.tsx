import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { HistoryFilters, type HistoryFilterValues } from "@/components/puket/HistoryFilters";
import { HistoryList } from "@/components/puket/HistoryList";
import { HistoryDetails } from "@/components/puket/HistoryDetails";
import { EmptyState } from "@/components/puket/EmptyState";
import { listAutomations } from "@/lib/api";
import type { HistoryEntry } from "@/types";

export const Route = createFileRoute("/historico")({ head: () => ({ meta: [{ title: "Histórico | Puket Cadastro Inteligente" }, { name: "description", content: "Acompanhe as automações demonstrativas por SKU e status." }] }), component: Historico });
const initialFilters: HistoryFilterValues = { query: "", period: "todos", operation: "todas", status: "todos" };
function Historico() {
  const [filters, setFilters] = useState(initialFilters);
  const [selected, setSelected] = useState<HistoryEntry | null>(null);
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([]);
  useEffect(() => { listAutomations().then(({ data }) => setHistoryEntries(data.map((job) => ({ id: job.id, dateTime: job.createdAt, operation: job.operation, sku: job.sku, product: job.result?.product || job.sku, user: "Equipe Puket", status: job.status === "completed" ? "concluido" : job.status === "warning" ? "atencao" : job.status === "error" ? "erro" : "processando", duration: job.status === "processing" ? "—" : `${Math.max(1, Math.round((Date.parse(job.updatedAt) - Date.parse(job.createdAt)) / 1000))}s`, summary: job.error?.message || (job.result ? `${job.result.variations} variações encontradas, ${job.result.created} criadas e ${job.result.stockUpdated} saldos atualizados.` : "Operação em andamento."), steps: job.steps.map((step) => ({ label: step.id, state: step.state, detail: step.state === "done" ? "Etapa concluída." : step.state === "error" ? job.error?.message || "Erro nesta etapa." : "Acompanhando processamento." })) }))), () => setHistoryEntries([])); }, []);
  const entries = useMemo(() => historyEntries.filter((entry) => {
    const query = filters.query.toLowerCase().trim();
    return (!query || entry.sku.toLowerCase().includes(query) || entry.product.toLowerCase().includes(query)) && (filters.operation === "todas" || entry.operation === filters.operation) && (filters.status === "todos" || entry.status === filters.status);
  }), [filters, historyEntries]);
  return <AppLayout><div className="mb-7"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-primary">Rastreabilidade</p><h1 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">Histórico de automações</h1><p className="mt-2 text-muted-foreground">Consulte as operações executadas e abra cada etapa em detalhes.</p></div><div className="space-y-5"><HistoryFilters values={filters} onChange={setFilters} />{entries.length ? <HistoryList entries={entries} onSelect={setSelected} /> : <EmptyState title="Nenhuma operação encontrada" description="Execute uma automação ou altere os filtros." />}</div><HistoryDetails entry={selected} onOpenChange={(open) => { if (!open) setSelected(null); }} /></AppLayout>;
}
