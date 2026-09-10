import { useMemo, useState } from "react";
import { AlertTriangle, ArrowLeft, CheckCircle2, Loader2, PackagePlus, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { getAutomation, previewAutomation, startAutomation } from "@/lib/api";
import type { OperationId, ProductEdits, ProductPreviewData } from "@/types";

type Mode = "missing" | "complete" | "sync";
type ItemState = "ready" | "running" | "done" | "skipped" | "error";
type BatchItem = { sku: string; preview: ProductPreviewData; selected: boolean; state: ItemState; message?: string };
const PARALLEL_LIMIT = 3;

async function runLimited<T, R>(values: T[], worker: (value: T) => Promise<R>): Promise<R[]> {
  const results = new Array<R>(values.length);
  let nextIndex = 0;
  const runner = async () => {
    while (nextIndex < values.length) {
      const index = nextIndex++;
      results[index] = await worker(values[index]!);
    }
  };
  await Promise.all(Array.from({ length: Math.min(PARALLEL_LIMIT, values.length) }, runner));
  return results;
}

const modeOptions: Array<{ id: Mode; title: string; detail: string }> = [
  { id: "missing", title: "Somente criar ausentes", detail: "Produtos que já existem serão preservados." },
  { id: "complete", title: "Criar e completar existentes", detail: "Cria ausentes e atualiza conteúdo e variações." },
  { id: "sync", title: "Atualizar tudo", detail: "Atualiza cadastro, variações, imagens e estoque." },
];

const editsFrom = (preview: ProductPreviewData): ProductEdits => ({
  name: preview.product.name,
  description: preview.product.description,
  price: preview.product.price,
  ncm: preview.product.ncm,
  categoryId: preview.product.categoryId,
  images: preview.product.images,
  dimensions: { width: preview.product.dimensions.width, height: preview.product.dimensions.height, depth: preview.product.dimensions.depth },
  netWeight: preview.product.dimensions.netWeight,
  grossWeight: preview.product.dimensions.grossWeight,
});

async function waitForJob(id: string) {
  for (let attempt = 0; attempt < 240; attempt++) {
    const job = await getAutomation(id);
    if (job.status !== "processing") return job;
    await new Promise(resolve => window.setTimeout(resolve, 750));
  }
  throw new Error("O processamento demorou mais que o esperado.");
}

export function DemandBatch({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("missing");
  const [items, setItems] = useState<BatchItem[]>([]);
  const [phase, setPhase] = useState<"input" | "review" | "running" | "done">("input");
  const [busy, setBusy] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const skus = useMemo(() => [...new Set(input.toUpperCase().split(/[\s,;]+/).map(value => value.trim()).filter(value => /^\d{6,}$/.test(value)))], [input]);
  const selectedCount = items.filter(item => item.selected).length;

  const applyMode = (next: Mode, source = items) => {
    setMode(next);
    setItems(source.map(item => ({ ...item, selected: next === "missing" ? (!item.preview.parentExists || item.preview.summary.toCreate > 0) : true })));
  };
  const analyze = async () => {
    if (!skus.length) return;
    setBusy(true); setGeneralError("");
    const analyzed = await runLimited(skus, async sku => {
      try {
        const preview = await previewAutomation("cadastrar-produto", sku);
        if (preview.kind !== "product") throw new Error("Resposta de produto inválida.");
        return { item: { sku, preview, selected: mode === "missing" ? (!preview.parentExists || preview.summary.toCreate > 0) : true, state: "ready" } as BatchItem, error: "" };
      } catch (error) {
        return { item: null, error: `${sku}: ${error instanceof Error ? error.message : "não encontrado"}` };
      }
    });
    const results = analyzed.flatMap(result => result.item ? [result.item] : []);
    setGeneralError(analyzed.map(result => result.error).filter(Boolean).join("\n"));
    setItems(results); setPhase("review"); setBusy(false);
  };
  const execute = async () => {
    setPhase("running");
    await runLimited(items, async current => {
      if (!current.selected) { setItems(value => value.map(item => item.sku === current.sku ? { ...item, state: "skipped" } : item)); return undefined; }
      setItems(value => value.map(item => item.sku === current.sku ? { ...item, state: "running", message: undefined } : item));
      try {
        const operation: OperationId = mode === "sync" ? "sincronizar-tudo" : mode === "complete" ? "atualizar-conteudo" : "cadastrar-produto";
        const created = await startAutomation(operation, current.sku, editsFrom(current.preview));
        const job = await waitForJob(created.id);
        if (job.status === "error") throw new Error(job.error?.message || "Não foi possível cadastrar.");
        setItems(value => value.map(item => item.sku === current.sku ? { ...item, state: "done", message: job.result?.existing ? "Cadastro conferido e preservado" : "Produto cadastrado" } : item));
      } catch (error) {
        setItems(value => value.map(item => item.sku === current.sku ? { ...item, state: "error", message: error instanceof Error ? error.message : "Falha no cadastro" } : item));
      }
      return undefined;
    });
    setPhase("done");
  };

  if (phase === "input") return <section className="surface-card mx-auto max-w-3xl p-6 sm:p-8">
    <div className="flex items-start gap-3"><span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent-foreground"><PackagePlus /></span><div><h2 className="font-display text-2xl font-bold">Cadastro sob demanda</h2><p className="text-sm text-muted-foreground">Cole produtos isolados. Até {PARALLEL_LIMIT} serão consultados ao mesmo tempo.</p></div></div>
    <div className="mt-6"><Label htmlFor="batch-skus" className="font-bold">SKUs dos produtos</Label><Textarea id="batch-skus" rows={8} value={input} onChange={event => setInput(event.target.value)} placeholder={"030402879\n030602815\n050404423"} className="mt-2 rounded-2xl font-mono"/><p className="mt-2 text-sm text-muted-foreground">Separe por linha, vírgula, espaço ou ponto e vírgula. {skus.length} SKU(s) válido(s).</p></div>
    {generalError && <p className="mt-4 whitespace-pre-line rounded-2xl bg-destructive-soft p-4 text-sm text-destructive">{generalError}</p>}
    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button variant="outline" className="rounded-full" onClick={onBack}><ArrowLeft/>Trocar operação</Button><Button className="rounded-full px-7" disabled={!skus.length || busy} onClick={() => void analyze()}>{busy ? <Loader2 className="animate-spin"/> : <Search/>}{busy ? "Consultando produtos..." : "Revisar produtos"}</Button></div>
  </section>;

  return <section className="surface-card mx-auto max-w-5xl overflow-hidden">
    <div className="border-b border-border bg-gradient-to-r from-accent/20 to-background p-6"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-primary">Cadastro sob demanda</p><h2 className="mt-1 font-display text-2xl font-bold">{phase === "done" ? "Processamento concluído" : "Revise antes de cadastrar"}</h2><p className="mt-1 text-sm text-muted-foreground">{items.length} produto(s) analisado(s) · {selectedCount} selecionado(s)</p></div>
    <div className="space-y-6 p-5 sm:p-7">
      {phase === "review" && <RadioGroup value={mode} onValueChange={value => applyMode(value as Mode)} className="grid gap-3 lg:grid-cols-3">{modeOptions.map(option => <Label key={option.id} htmlFor={`mode-${option.id}`} className={`flex cursor-pointer gap-3 rounded-2xl border p-4 ${mode === option.id ? "border-primary bg-primary-soft" : "border-border"}`}><RadioGroupItem id={`mode-${option.id}`} value={option.id}/><span><strong className="block">{option.title}</strong><span className="mt-1 block text-xs font-normal text-muted-foreground">{option.detail}</span></span></Label>)}</RadioGroup>}
      <div className="space-y-3">{items.map(item => <article key={item.sku} className="flex items-center gap-4 rounded-2xl border border-border p-4">
        {phase === "review" ? <Checkbox checked={item.selected} disabled={mode === "missing" && item.preview.parentExists && item.preview.summary.toCreate === 0} onCheckedChange={checked => setItems(value => value.map(entry => entry.sku === item.sku ? { ...entry, selected: checked === true } : entry))}/> : item.state === "running" ? <Loader2 className="h-5 w-5 animate-spin text-primary"/> : item.state === "done" ? <CheckCircle2 className="h-5 w-5 text-success"/> : item.state === "error" ? <AlertTriangle className="h-5 w-5 text-destructive"/> : <span className="h-5 w-5 rounded-full border"/>}
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-white">{item.preview.product.images[0] ? <img src={item.preview.product.images[0]} alt="" className="h-full w-full object-contain p-1"/> : <PackagePlus className="text-muted-foreground"/>}</div>
        <div className="min-w-0 flex-1"><p className="truncate font-bold">{item.preview.product.name}</p><p className="font-mono text-xs text-muted-foreground">{item.sku} · {item.preview.summary.total} variações · {item.preview.product.images.length} imagens</p>{item.message && <p className={`mt-1 text-xs ${item.state === "error" ? "text-destructive" : "text-success-foreground"}`}>{item.message}</p>}</div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.preview.parentExists && item.preview.summary.toCreate === 0 ? "bg-success-soft text-success-foreground" : "bg-info-soft text-info-foreground"}`}>{!item.preview.parentExists ? "Será criado" : item.preview.summary.toCreate > 0 ? `${item.preview.summary.toCreate} variação(ões) faltando` : "Completo"}</span>
      </article>)}</div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between"><Button variant="outline" className="rounded-full" disabled={phase === "running"} onClick={() => { setPhase("input"); setItems([]); }}><ArrowLeft/>Editar lista</Button>{phase === "review" && <Button className="rounded-full px-7" disabled={!selectedCount} onClick={() => void execute()}><Play/>Processar {selectedCount} produto(s)</Button>}{phase === "done" && <Button className="rounded-full px-7" onClick={() => { setInput(""); setItems([]); setPhase("input"); }}>Novo lote</Button>}</div>
    </div>
  </section>;
}
