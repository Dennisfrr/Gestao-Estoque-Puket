import type { AutomationJob, CatalogFilters, CatalogProduct, IntegrationStatus, KitPreviewData, OperationId, ProductEdits, ProductPreviewData } from "@/types";

export type CopilotHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export type CopilotKitDraft = {
  nome: string;
  componentes: Array<{
    codigo: string;
    nome: string;
    quantidade: number;
    disponivel: number;
    preco: number;
  }>;
  disponibilidade: number;
  preco: number;
};

export type CopilotResponse = {
  resposta: string;
  rascunhoKit: CopilotKitDraft | null;
};

const API_URL = String(import.meta.env.VITE_API_URL || "http://localhost:3030").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 60000);
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.error || `A API respondeu ${response.status}.`);
    return body as T;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw new Error("O backend demorou para responder.");
    throw error;
  } finally { window.clearTimeout(timeout); }
}

export async function checkHealth() { return request<{ status: string }>("/health"); }
export async function generateSeoDescription(input: {
  nome: string;
  descricaoCatalogo?: string;
  descricaoLinx?: string;
  descricaoAtual?: string;
}) {
  return request<{ descricao: string }>("/api/descricao-seo", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
export async function sendCopilotMessage(mensagem: string, historico: CopilotHistoryMessage[]) {
  return request<CopilotResponse>("/api/assistente-estoque", {
    method: "POST",
    body: JSON.stringify({ mensagem, historico }),
  });
}
export async function startAutomation(operacao: OperationId, sku: string, edits?: ProductEdits) {
  return request<{ id: string; status: string }>("/api/automacoes", { method: "POST", body: JSON.stringify({ operacao, sku, edits }) });
}
export async function previewAutomation(operacao: OperationId, sku: string) {
  return request<ProductPreviewData | KitPreviewData>("/api/automacoes/preview", { method: "POST", body: JSON.stringify({ operacao, sku }) });
}
export async function getAutomation(id: string) { return request<AutomationJob>(`/api/automacoes/${id}`); }
export async function listAutomations() { return request<{ data: AutomationJob[] }>("/api/automacoes"); }
export async function getIntegrationStatus() { return request<{ data: IntegrationStatus[] }>("/api/integracoes/status"); }
export async function getCatalogFilters() { return request<{ success: boolean; filtros: CatalogFilters }>("/api/catalogo/filtros"); }
export async function searchCatalog(params: Record<string, string | number>) {
  const query = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== "" && value !== undefined).map(([key, value]) => [key, String(value)])).toString();
  return request<{ success: boolean; total: number; pagina: number; limite: number; temMais: boolean; produtos: CatalogProduct[] }>(`/api/catalogo/buscar?${query}`);
}
