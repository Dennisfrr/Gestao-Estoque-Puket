export type OperationId =
  | "cadastrar-produto"
  | "cadastro-sob-demanda"
  | "variacoes-ausentes"
  | "criar-kit"
  | "atualizar-estoque"
  | "atualizar-conteudo"
  | "verificar-cadastro"
  | "sincronizar-tudo";

export type OperationTone = "primary" | "accent" | "info" | "grape" | "success";

export interface Operation {
  id: OperationId;
  title: string;
  description: string;
  hint: string;
  icon: string;
  tone: OperationTone;
}

export type StepState = "waiting" | "running" | "done" | "warning" | "error";

export interface ProgressStepData {
  id: string;
  label: string;
  detail: string;
}

export type ResultKind = "success" | "warning" | "error";

export interface ResultMetricData {
  id: string;
  label: string;
  value: string;
  icon: string;
  tone: OperationTone;
}

export type HistoryStatus = "concluido" | "atencao" | "erro" | "processando";

export interface HistoryEntry {
  id: string;
  dateTime: string;
  operation: OperationId;
  sku: string;
  product: string;
  user: string;
  status: HistoryStatus;
  duration: string;
  steps: { label: string; state: StepState; detail: string }[];
  summary: string;
}

export type IntegrationState = "operacional" | "instavel" | "offline" | "manutencao";

export interface IntegrationStatus {
  id: string;
  name: string;
  icon: string;
  state: IntegrationState;
  lastCheck: string;
  description: string;
}

export interface AutomationResultData {
  parentSku: string;
  product: string;
  created: number;
  existing: boolean;
  variations: number;
  stockUpdated: number;
  images: number;
  warnings: string[];
}

export interface AutomationJob {
  id: string;
  operation: OperationId;
  sku: string;
  status: "processing" | "completed" | "warning" | "error";
  createdAt: string;
  updatedAt: string;
  steps: { id: string; state: StepState }[];
  result: AutomationResultData | null;
  error: { message: string; step: string } | null;
}

export interface ProductPreviewVariation {
  parentSku: string;
  childSku: string;
  colorName: string;
  size: string;
  barcode: string;
  price: number;
  stock: number;
  image: string;
  status: "existing" | "new" | "duplicate";
  blingSku: string;
  blingId: number | null;
  message: string;
}

export interface ProductPreviewData {
  kind: "product";
  operation: OperationId;
  requestedSku: string;
  parentExists: boolean;
  canApprove: boolean;
  product: {
    parentSku: string; name: string; description: string; catalogDescription: string; linxDescription: string; image: string; images: string[]; price: number; catalogPrice: number; linxPrice: number; ncm: string; categoryId: number; brand: string;
    dimensions: { width: number; height: number; depth: number; netWeight: number; grossWeight: number; detected: boolean };
    bling: { name: string; description: string; price: number; ncm: string; categoryId: number | null; image: string; images: string[] } | null;
  };
  summary: { total: number; existing: number; toCreate: number; duplicates: number };
  variations: ProductPreviewVariation[];
  warnings: string[];
}

export interface ProductEdits { name: string; description: string; price: number; ncm: string; categoryId: number; images: string[]; dimensions: { width: number; height: number; depth: number }; netWeight: number; grossWeight: number; }

export interface KitPreviewData {
  kind: "kit"; operation: "criar-kit"; requestedSku: string; canApprove: boolean;
  kit: { sku: string; exists: boolean; productExists: boolean; structureStatus: "new" | "missing" | "valid" | "conflict"; name: string; description: string; price: number; images: string[]; ncm: string; categoryId: number; dimensions: { width: number; height: number; depth: number; netWeight: number; grossWeight: number }; availability: number };
  components: Array<{ requestedSku: string; parentSku: string; childSku: string; barcode: string; name: string; image: string; price: number; stock: number; status: "existing" | "missing" | "duplicate"; blingId: number | null; blingSku: string }>;
  warnings: string[];
}

export interface CatalogOption { codigo: string; descricao: string }
export interface CatalogProduct { nome: string; id: string; descricao: string; preco: number; precoOriginal: number; imagens: string[]; variacoes: unknown[] }
export interface CatalogFilters { linhas: CatalogOption[]; grupos: CatalogOption[]; tamanhos: CatalogOption[]; sexos: CatalogOption[]; cores: CatalogOption[]; solucoes: CatalogOption[] }
