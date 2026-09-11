import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AlertTriangle, BadgeCheck, Check, CheckCircle2, ChevronLeft, ChevronRight, ImageOff, Loader2, RefreshCw, Search, Send, ShoppingBag } from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { checkCatalogProductsInBling, getAutomation, getCatalogFilters, previewAutomation, searchCatalog, startAutomation } from "@/lib/api";
import type { CatalogFilters, CatalogProduct, ProductEdits, ProductPreviewData } from "@/types";

export const Route = createFileRoute("/catalogo")({ head: () => ({ meta: [{ title: "Catálogo | Puket Cadastro Inteligente" }, { name: "description", content: "Explore o catálogo Puket e envie produtos selecionados ao Bling." }] }), component: CatalogPage });
type SendState = "idle" | "review" | "sending" | "done";
type BlingFilter = "all" | "exists" | "missing";
type BlingState = { state: "checking" | "exists" | "missing" | "error"; id?: number; message?: string };
const emptyFilters: CatalogFilters = { linhas: [], grupos: [], tamanhos: [], sexos: [], cores: [], solucoes: [] };
const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

async function limited<T>(values: T[], worker: (value: T) => Promise<void>) {
  let next = 0;
  const runner = async () => { while (next < values.length) await worker(values[next++]!); };
  await Promise.all(Array.from({ length: Math.min(3, values.length) }, runner));
}
async function waitJob(id: string) {
  for (let index = 0; index < 240; index++) { const job = await getAutomation(id); if (job.status !== "processing") return job; await new Promise(resolve => window.setTimeout(resolve, 750)); }
  throw new Error("O processamento demorou mais que o esperado.");
}
const editsFrom = (preview: ProductPreviewData): ProductEdits => ({ name: preview.product.name, description: preview.product.description, price: preview.product.price, ncm: preview.product.ncm, categoryId: preview.product.categoryId, images: preview.product.images, dimensions: { width: preview.product.dimensions.width, height: preview.product.dimensions.height, depth: preview.product.dimensions.depth }, netWeight: preview.product.dimensions.netWeight, grossWeight: preview.product.dimensions.grossWeight });

function CatalogPage() {
  const [filters, setFilters] = useState(emptyFilters);
  const [query, setQuery] = useState(""); const [line, setLine] = useState(""); const [group, setGroup] = useState(""); const [solution, setSolution] = useState("");
  const [products, setProducts] = useState<CatalogProduct[]>([]); const [selected, setSelected] = useState<string[]>([]); const [page, setPage] = useState(0); const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true); const [sendState, setSendState] = useState<SendState>("idle"); const [progress, setProgress] = useState<Record<string, { state: string; message?: string }>>({}); const [error, setError] = useState("");
  const [blingStatus, setBlingStatus] = useState<Record<string, BlingState>>({});
  const [blingFilter, setBlingFilter] = useState<BlingFilter>("all");
  const [checkingBling, setCheckingBling] = useState(false);
  const blingCheckId = useRef(0);

  const checkBling = async (items: CatalogProduct[]) => {
    const checkId = ++blingCheckId.current;
    setCheckingBling(true);
    setBlingStatus(Object.fromEntries(items.map(product => [product.id, { state: "checking" }])));
    try {
      const result = await checkCatalogProductsInBling(items.map(product => product.id));
      if (checkId !== blingCheckId.current) return;
      setBlingStatus(Object.fromEntries(items.map(product => {
        const item = result[product.id];
        if (item?.error) return [product.id, { state: "error", message: item.error } satisfies BlingState];
        return [product.id, item?.existe
          ? { state: "exists", id: item.id } satisfies BlingState
          : { state: "missing" } satisfies BlingState];
      })));
    } catch (reason) {
      if (checkId !== blingCheckId.current) return;
      const message = reason instanceof Error ? reason.message : "Falha ao consultar o Bling";
      setBlingStatus(Object.fromEntries(items.map(product => [product.id, { state: "error", message }])));
    } finally {
      if (checkId === blingCheckId.current) setCheckingBling(false);
    }
  };

  const load = async (nextPage = 0) => { setLoading(true); setError(""); try { const response = await searchCatalog({ q: query, linhas: line, grupos: group, solucoes: solution, pagina: nextPage, limite: 24 }); setProducts(response.produtos); setPage(response.pagina); setHasMore(response.temMais); setSelected([]); setSendState("idle"); setBlingFilter("all"); void checkBling(response.produtos); } catch (reason) { setError(reason instanceof Error ? reason.message : "Não foi possível carregar o catálogo."); } finally { setLoading(false); } };
  useEffect(() => { getCatalogFilters().then(response => setFilters(response.filtros)).catch(() => undefined); void load(0); }, []);
  const chosen = products.filter(product => selected.includes(product.id));
  const sentCount = Object.values(progress).filter(item => item.state === "done").length;
  const errorCount = Object.values(progress).filter(item => item.state === "error").length;
  const send = async () => { setSendState("sending"); setProgress(Object.fromEntries(chosen.map(product => [product.id, { state: "waiting" }]))); await limited(chosen, async product => { setProgress(value => ({ ...value, [product.id]: { state: "running" } })); try { const preview = await previewAutomation("cadastrar-produto", product.id); if (preview.kind !== "product") throw new Error("Produto inválido."); const started = await startAutomation("cadastrar-produto", product.id, editsFrom(preview)); const job = await waitJob(started.id); if (job.status === "error") throw new Error(job.error?.message || "Falha no cadastro."); setProgress(value => ({ ...value, [product.id]: { state: "done", message: job.result?.created ? `${job.result.created} variação(ões) criada(s)` : "Cadastro já estava completo" } })); setBlingStatus(value => ({ ...value, [product.id]: { state: "exists" } })); } catch (reason) { setProgress(value => ({ ...value, [product.id]: { state: "error", message: reason instanceof Error ? reason.message : "Falha no cadastro" } })); } }); setSendState("done"); };
  const visibleProducts = products.filter(product => blingFilter === "all" || blingStatus[product.id]?.state === blingFilter);
  const existingCount = products.filter(product => blingStatus[product.id]?.state === "exists").length;
  const missingCount = products.filter(product => blingStatus[product.id]?.state === "missing").length;
  const allVisibleSelected = visibleProducts.length > 0 && visibleProducts.every(product => selected.includes(product.id));
  const selectAll = () => setSelected(current => allVisibleSelected ? current.filter(id => !visibleProducts.some(product => product.id === id)) : [...new Set([...current, ...visibleProducts.map(product => product.id)])]);
  const reviewOne = (id: string) => { setSelected([id]); setProgress({}); setSendState("review"); };
  return <AppLayout><div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-extrabold uppercase tracking-[.18em] text-primary">Catálogo integrado</p><h1 className="mt-1 font-display text-3xl font-extrabold sm:text-5xl">Catálogo Puket</h1><p className="mt-2 text-muted-foreground">Encontre, selecione e envie produtos completos para o Bling.</p></div>{selected.length > 0 && <Button className="h-12 rounded-full px-6" onClick={() => setSendState("review")}><Send/>Enviar {selected.length} para o Bling</Button>}</div>
    <section className="surface-card mb-6 p-4 sm:p-5"><div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5"><div className="relative xl:col-span-2"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"/><Input value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => event.key === "Enter" && void load(0)} placeholder="Buscar produto" className="rounded-xl pl-9"/></div><FilterSelect label="Todas as linhas" value={line} setValue={setLine} options={filters.linhas}/><FilterSelect label="Todos os modelos" value={group} setValue={setGroup} options={filters.grupos}/><FilterSelect label="Todos os personagens" value={solution} setValue={setSolution} options={filters.solucoes}/></div><div className="mt-3 flex justify-end"><Button className="rounded-full" onClick={() => void load(0)} disabled={loading}>{loading ? <Loader2 className="animate-spin"/> : <Search/>}Aplicar filtros</Button></div></section>
    {!loading && products.length > 0 && <section className="mb-6 flex flex-col gap-3 rounded-2xl border bg-card p-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex flex-wrap gap-2"><BlingFilterButton active={blingFilter === "all"} onClick={() => setBlingFilter("all")}>Todos <strong>{products.length}</strong></BlingFilterButton><BlingFilterButton active={blingFilter === "exists"} onClick={() => setBlingFilter("exists")} tone="success">No Bling <strong>{checkingBling ? "…" : existingCount}</strong></BlingFilterButton><BlingFilterButton active={blingFilter === "missing"} onClick={() => setBlingFilter("missing")} tone="warning">Não enviados <strong>{checkingBling ? "…" : missingCount}</strong></BlingFilterButton></div><Button variant="ghost" className="rounded-full" onClick={() => void checkBling(products)} disabled={checkingBling}>{checkingBling ? <Loader2 className="animate-spin"/> : <RefreshCw/>}{checkingBling ? "Consultando Bling" : "Atualizar situação"}</Button></section>}
    {error && <p className="mb-5 rounded-2xl bg-destructive-soft p-4 text-destructive">{error}</p>}
    {!loading && visibleProducts.length > 0 && <div className="mb-4 flex items-center justify-between"><button className="text-sm font-bold text-primary" onClick={selectAll}>{allVisibleSelected ? "Desmarcar visíveis" : "Selecionar visíveis"}</button><span className="text-sm text-muted-foreground">Página {page + 1}</span></div>}
    {loading ? <div className="grid min-h-80 place-items-center"><Loader2 className="h-9 w-9 animate-spin text-primary"/></div> : visibleProducts.length === 0 ? <div className="surface-card grid min-h-64 place-items-center p-8 text-center"><div><ShoppingBag className="mx-auto h-10 w-10 text-muted-foreground"/><p className="mt-3 font-display text-xl font-bold">Nenhum produto nesta situação</p><p className="mt-1 text-sm text-muted-foreground">Escolha outro filtro ou atualize a consulta ao Bling.</p></div></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{visibleProducts.map(product => { const checked = selected.includes(product.id); const status = progress[product.id]; const bling = blingStatus[product.id]; return <article key={product.id} className={`surface-card overflow-hidden border-2 ${checked ? "border-primary" : "border-transparent"}`}><div className="relative aspect-square bg-white"><Checkbox checked={checked} onCheckedChange={value => setSelected(current => value === true ? [...new Set([...current, product.id])] : current.filter(id => id !== product.id))} className="absolute left-4 top-4 z-10 h-6 w-6 bg-white"/><BlingStatus status={bling}/>{product.imagens?.[0] ? <img src={product.imagens[0]} alt={product.nome} className="h-full w-full object-contain p-4"/> : <div className="grid h-full place-items-center"><ImageOff className="h-10 w-10 text-muted-foreground"/></div>}</div><div className="p-4"><p className="line-clamp-2 min-h-12 font-bold">{product.nome}</p><p className="mt-1 font-mono text-xs text-muted-foreground">{product.id}</p><div className="mt-3 flex items-end justify-between"><div>{Number(product.precoOriginal) > Number(product.preco) && <p className="text-xs text-muted-foreground line-through">{money.format(Number(product.precoOriginal))}</p>}<p className="font-display text-xl font-extrabold text-primary">{money.format(Number(product.preco))}</p></div><span className="text-xs font-semibold text-muted-foreground">{product.imagens?.length || 0} imagens</span></div>{status && <p className={`mt-3 rounded-xl p-2 text-xs font-bold ${status.state === "done" ? "bg-success-soft text-success-foreground" : status.state === "error" ? "bg-destructive-soft text-destructive" : "bg-primary-soft text-primary"}`}>{status.state === "running" ? "Enviando..." : status.message}</p>}<Button variant={bling?.state === "exists" ? "outline" : "default"} className="mt-4 w-full rounded-full" onClick={() => reviewOne(product.id)} disabled={sendState === "sending"}>{bling?.state === "exists" ? <BadgeCheck/> : <Send/>}{bling?.state === "exists" ? "Revisar cadastro no Bling" : "Enviar para o Bling"}</Button></div></article>; })}</div>}
    {!loading && <div className="mt-7 flex justify-center gap-3"><Button variant="outline" className="rounded-full" disabled={page === 0} onClick={() => void load(page - 1)}><ChevronLeft/>Anterior</Button><Button variant="outline" className="rounded-full" disabled={!hasMore} onClick={() => void load(page + 1)}>Próxima<ChevronRight/></Button></div>}
    {sendState === "review" && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/45 p-4"><section className="surface-card max-h-[85vh] w-full max-w-xl overflow-auto p-6"><ShoppingBag className="h-9 w-9 text-primary"/><h2 className="mt-3 font-display text-2xl font-bold">Enviar {chosen.length} produto(s)?</h2><p className="mt-2 text-sm text-muted-foreground">O sistema consultará Linx e Bling, criará produtos e variações ausentes e preservará cadastros existentes.</p><div className="mt-4 max-h-64 space-y-2 overflow-auto">{chosen.map(product => <p key={product.id} className="rounded-xl bg-secondary p-3 text-sm font-semibold">{product.nome}<span className="block font-mono text-xs text-muted-foreground">{product.id}</span></p>)}</div><div className="mt-6 flex justify-end gap-3"><Button variant="outline" className="rounded-full" onClick={() => setSendState("idle")}>Cancelar</Button><Button className="rounded-full" onClick={() => void send()}><Check/>Confirmar envio</Button></div></section></div>}
    {sendState === "done" && <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/45 p-4"><section role="dialog" aria-modal="true" aria-labelledby="resultado-envio" className="surface-card w-full max-w-lg overflow-hidden text-center"><div className={`p-7 ${errorCount ? "bg-accent-soft" : "bg-success-soft"}`}><span className={`mx-auto grid h-20 w-20 place-items-center rounded-full bg-background ${errorCount ? "text-accent-foreground" : "text-success"}`}>{errorCount ? <AlertTriangle className="h-10 w-10"/> : <CheckCircle2 className="h-10 w-10"/>}</span><h2 id="resultado-envio" className="mt-4 font-display text-3xl font-extrabold">{errorCount ? "Envio concluído com atenção" : "Enviado para o Bling!"}</h2><p className="mt-2 text-muted-foreground">{errorCount ? "Os produtos concluídos foram enviados e os erros ficaram sinalizados." : "Todos os produtos selecionados foram processados com sucesso."}</p></div><div className="p-6"><div className="grid grid-cols-2 gap-3"><div className="rounded-2xl bg-success-soft p-4"><strong className="block font-display text-3xl text-success-foreground">{sentCount}</strong><span className="text-sm font-semibold text-success-foreground">Concluídos</span></div><div className={`rounded-2xl p-4 ${errorCount ? "bg-destructive-soft" : "bg-secondary"}`}><strong className={`block font-display text-3xl ${errorCount ? "text-destructive" : "text-muted-foreground"}`}>{errorCount}</strong><span className={`text-sm font-semibold ${errorCount ? "text-destructive" : "text-muted-foreground"}`}>Com erro</span></div></div>{errorCount > 0 && <div className="mt-4 max-h-36 space-y-2 overflow-auto text-left">{chosen.filter(product => progress[product.id]?.state === "error").map(product => <div key={product.id} className="rounded-xl bg-destructive-soft p-3"><p className="text-sm font-bold text-destructive">{product.nome}</p><p className="mt-1 text-xs text-destructive">{progress[product.id]?.message}</p></div>)}</div>}<div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"><Button variant="outline" className="rounded-full px-6" onClick={() => setSendState("idle")}>Ver resultados</Button><Button className="rounded-full px-6" onClick={() => { setSelected([]); setProgress({}); setSendState("idle"); }}><Check/>Concluir</Button></div></div></section></div>}
  </AppLayout>;
}

function FilterSelect({ label, value, setValue, options }: { label: string; value: string; setValue: (value: string) => void; options: Array<{ codigo: string; descricao: string }> }) { return <select value={value} onChange={event => setValue(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"><option value="">{label}</option>{options.map(option => <option key={option.codigo} value={option.codigo}>{option.descricao}</option>)}</select>; }

function BlingFilterButton({ active, tone = "default", onClick, children }: { active: boolean; tone?: "default" | "success" | "warning"; onClick: () => void; children: ReactNode }) {
  const colors = tone === "success" ? "bg-success-soft text-success-foreground" : tone === "warning" ? "bg-accent-soft text-accent-foreground" : "bg-secondary text-foreground";
  return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-bold transition ${colors} ${active ? "ring-2 ring-primary ring-offset-2" : "opacity-75 hover:opacity-100"}`}>{children}</button>;
}

function BlingStatus({ status }: { status?: BlingState }) {
  if (!status || status.state === "checking") return <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-bold text-muted-foreground shadow"><Loader2 className="h-3.5 w-3.5 animate-spin"/>Consultando</span>;
  if (status.state === "exists") return <span title={status.id ? `Produto Bling #${status.id}` : undefined} className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1.5 text-xs font-extrabold text-success-foreground shadow"><BadgeCheck className="h-4 w-4"/>Já está no Bling</span>;
  if (status.state === "error") return <span title={status.message} className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-destructive-soft px-3 py-1.5 text-xs font-extrabold text-destructive shadow"><AlertTriangle className="h-4 w-4"/>Falha ao conferir</span>;
  return <span className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1.5 text-xs font-extrabold text-accent-foreground shadow"><Send className="h-4 w-4"/>Ainda não enviado</span>;
}
