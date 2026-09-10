import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AppLayout } from "@/layouts/AppLayout";
import { OperationSelector } from "@/components/puket/OperationSelector";
import { SkuInput } from "@/components/puket/SkuInput";
import { ScannerDemoModal } from "@/components/puket/ScannerDemoModal";
import { AutomationProgress } from "@/components/puket/AutomationProgress";
import { AutomationResult } from "@/components/puket/AutomationResult";
import { ProductPreview } from "@/components/puket/ProductPreview";
import { KitPreview } from "@/components/puket/KitPreview";
import { DemandBatch } from "@/components/puket/DemandBatch";
import { progressSteps } from "@/mocks/automation";
import { getAutomation, previewAutomation, startAutomation } from "@/lib/api";
import type { AutomationJob, KitPreviewData, Operation, ProductEdits, ProductPreviewData, ResultKind, StepState } from "@/types";

export const Route = createFileRoute("/")({ head: () => ({ meta: [{ title: "Automatizar | Puket Cadastro Inteligente" }, { name: "description", content: "Escolha uma operação, informe o SKU e acompanhe a automação." }] }), component: Index });
type Screen = "select" | "sku" | "review" | "progress" | "result";

function Index() {
  const [screen, setScreen] = useState<Screen>("select");
  const [operation, setOperation] = useState<Operation | null>(null);
  const [sku, setSku] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [job, setJob] = useState<AutomationJob | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [resultKind, setResultKind] = useState<ResultKind>("success");
  const [preview, setPreview] = useState<ProductPreviewData | KitPreviewData | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [edits, setEdits] = useState<ProductEdits | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { if (screen === "sku") inputRef.current?.focus(); }, [screen]);
  useEffect(() => {
    if (screen !== "progress") return;
    const timer = window.setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, [screen]);
  useEffect(() => {
    if (screen !== "progress" || !jobId) return;
    let cancelled = false;
    const poll = async () => {
      try {
        const current = await getAutomation(jobId);
        if (cancelled) return;
        setJob(current);
        if (current.status !== "processing") {
          setResultKind(current.status === "completed" ? "success" : current.status === "warning" ? "warning" : "error");
          setScreen("result");
          return;
        }
        window.setTimeout(poll, 700);
      } catch (error) {
        if (cancelled) return;
        setJob((current) => ({ id: jobId, operation: operation!.id, sku, status: "error", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), steps: current?.steps || [], result: null, error: { message: error instanceof Error ? error.message : "Falha ao consultar a automação.", step: "backend" } }));
        setResultKind("error"); setScreen("result");
      }
    };
    poll();
    return () => { cancelled = true; };
  }, [jobId, operation, screen, sku]);
  const states: StepState[] = progressSteps.map((step) => job?.steps.find((item) => item.id === step.id)?.state ?? "waiting");
  const restart = () => { setScreen("select"); setOperation(null); setSku(""); setElapsed(0); setJob(null); setJobId(null); setPreview(null); setEdits(null); };
  const review = async () => {
    if (!operation) return;
    setPreviewing(true);
    try { const data = await previewAutomation(operation.id, sku); setPreview(data); setScreen("review"); }
    catch (error) { setJob({ id: "preview-error", operation: operation.id, sku, status: "error", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), steps: [], result: null, error: { message: error instanceof Error ? error.message : "Não foi possível visualizar o produto.", step: "consulta" } }); setResultKind("error"); setScreen("result"); }
    finally { setPreviewing(false); }
  };
  const run = async (approvedEdits?: ProductEdits) => {
    if (!operation) return;
    setElapsed(0); setJob(null); setScreen("progress");
    try { const created = await startAutomation(operation.id, sku, approvedEdits); setJobId(created.id); }
    catch (error) { setJob({ id: "local-error", operation: operation.id, sku, status: "error", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), steps: [], result: null, error: { message: error instanceof Error ? error.message : "Não foi possível iniciar.", step: "backend" } }); setResultKind("error"); setScreen("result"); }
  };
  const start = () => run(edits ?? undefined);

  return <AppLayout><div className="relative">
    <span className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-accent/25 blur-sm" /><span className="pointer-events-none absolute -left-12 top-40 h-24 w-24 rounded-full bg-info/20" />
    <div className="relative mb-8"><p className="text-sm font-extrabold uppercase tracking-[.18em] text-primary">Cadastro inteligente</p><h1 className="mt-2 max-w-3xl font-display text-3xl font-extrabold sm:text-5xl">Olá! O que vamos automatizar hoje?</h1><p className="mt-3 max-w-2xl text-base text-muted-foreground sm:text-lg">Escolha uma operação e informe o SKU. O sistema cuida do restante.</p></div>
    {screen === "select" && <OperationSelector selectedId={operation?.id ?? null} onSelect={(item) => { setOperation(item); setScreen("sku"); }} />}
    {screen === "sku" && operation && (operation.id === "cadastro-sob-demanda" ? <DemandBatch onBack={() => { setScreen("select"); setOperation(null); }} /> : <SkuInput operation={operation} value={sku} onChange={setSku} onExecute={review} onOpenScanner={() => setScannerOpen(true)} onChangeOperation={() => setScreen("select")} inputRef={inputRef} loading={previewing} buttonLabel={operation.id === "criar-kit" ? "Visualizar kit" : "Visualizar produto"} />)}
    {screen === "review" && operation && preview && (preview.kind === "kit" ? <KitPreview preview={preview} onBack={() => setScreen("sku")} onApprove={(values) => { setEdits(values); void run(values); }} /> : <ProductPreview preview={preview} operation={operation} onBack={() => setScreen("sku")} onApprove={(values) => { setEdits(values); void run(values); }} />)}
    {screen === "progress" && operation && <AutomationProgress operation={operation} sku={sku} steps={progressSteps} states={states} elapsed={elapsed} />}
    {screen === "result" && operation && <AutomationResult kind={resultKind} operation={operation} sku={sku} result={job?.result ?? null} error={job?.error ?? null} onRestart={restart} onRetry={start} onFixSku={() => setScreen("sku")} />}
    <ScannerDemoModal open={scannerOpen} onOpenChange={setScannerOpen} onTypeInstead={() => { setScannerOpen(false); window.setTimeout(() => inputRef.current?.focus(), 50); }} />
  </div></AppLayout>;
}
