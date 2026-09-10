import type { ProgressStepData, ResultMetricData } from "@/types";

export const progressSteps: ProgressStepData[] = [
  { id: "linx", label: "Conectando ao Linx", detail: "Abrindo a conexão com o ERP." },
  { id: "produto", label: "Buscando produto", detail: "Procurando o SKU informado." },
  { id: "pai", label: "Identificando produto-pai", detail: "Descobrindo o produto principal." },
  { id: "grade", label: "Encontrando cores e tamanhos", detail: "Montando a grade completa." },
  { id: "bling", label: "Consultando Bling", detail: "Verificando o que já existe por lá." },
  { id: "comparando", label: "Comparando cadastros", detail: "Vendo o que falta ou mudou." },
  { id: "gravando", label: "Criando ou atualizando", detail: "Gravando produto e variações." },
  { id: "estoque", label: "Sincronizando estoque", detail: "Ajustando os saldos." },
  { id: "final", label: "Finalizando", detail: "Fechando o relatório da operação." },
];

export const successMetrics: ResultMetricData[] = [
  { id: "pai", label: "Produto-pai", value: "Localizado", icon: "Shirt", tone: "primary" },
  { id: "encontradas", label: "Variações encontradas", value: "8", icon: "Grid2x2", tone: "grape" },
  { id: "criadas", label: "Variações criadas", value: "3", icon: "Sparkles", tone: "accent" },
  { id: "estoques", label: "Estoques atualizados", value: "8", icon: "Boxes", tone: "info" },
  { id: "imagens", label: "Imagens adicionadas", value: "5", icon: "Image", tone: "success" },
  { id: "tempo", label: "Tempo de processamento", value: "12s", icon: "Timer", tone: "primary" },
];

export const demoResult = {
  sku: "030402879",
  product: "Pijama Manga Longa",
};

export const warningResult = {
  title: "Concluído com atenção",
  message: "O produto foi atualizado, mas uma variação precisa de revisão.",
  done: [
    "Produto-pai atualizado no Bling",
    "7 variações sincronizadas",
    "5 imagens adicionadas",
  ],
  review: [
    "A variação 030402879-ROSA-PP está sem preço de venda",
    "Saldo de estoque não pôde ser lido para essa variação",
  ],
  problemSku: "030402879145",
};

export const errorResult = {
  title: "Não conseguimos concluir",
  message: "O produto não foi encontrado na Linx.",
  step: "Buscando produto",
  explanation: "Procuramos o SKU informado no Linx e nenhum produto foi retornado.",
  suggestions: [
    "Confira se o SKU foi digitado ou escaneado por completo",
    "Verifique se o produto já foi cadastrado no Linx",
    "Se for um kit, use o SKU composto com underline",
  ],
};
