import type { Operation, OperationId } from "@/types";

export const operations: Operation[] = [
  {
    id: "cadastro-sob-demanda",
    title: "Cadastro sob demanda",
    description: "Cole vários SKUs e cadastre somente os produtos escolhidos.",
    hint: "Revise vários produtos isolados e envie todos de uma vez.",
    icon: "PackagePlus",
    tone: "accent",
  },
  {
    id: "cadastrar-produto",
    title: "Cadastrar produto e variações",
    description: "Crie o produto-pai com todas as suas cores e tamanhos.",
    hint: "Informe o SKU do produto para criarmos o produto-pai e todas as variações.",
    icon: "Shirt",
    tone: "primary",
  },
  {
    id: "variacoes-ausentes",
    title: "Adicionar variações ausentes",
    description: "Encontre e adicione somente as variações que estiverem faltando.",
    hint: "Comparamos a grade completa e criamos apenas o que estiver faltando.",
    icon: "Grid2x2Plus",
    tone: "grape",
  },
  {
    id: "criar-kit",
    title: "Criar kit",
    description: "Monte automaticamente o kit e sua composição.",
    hint: "Use o SKU composto do kit para montarmos a composição automaticamente.",
    icon: "Gift",
    tone: "accent",
  },
  {
    id: "atualizar-estoque",
    title: "Atualizar estoque",
    description: "Sincronize o saldo de todas as variações.",
    hint: "Sincronizamos o saldo de cada variação do produto informado.",
    icon: "Boxes",
    tone: "info",
  },
  {
    id: "atualizar-conteudo",
    title: "Atualizar conteúdo",
    description: "Atualize imagens, nome e descrição do produto.",
    hint: "Atualizamos imagens, nome e descrição a partir do catálogo Puket.",
    icon: "Sparkles",
    tone: "grape",
  },
  {
    id: "verificar-cadastro",
    title: "Verificar cadastro",
    description: "Confira se o cadastro está completo e correto.",
    hint: "Fazemos uma conferência completa sem alterar nada.",
    icon: "SearchCheck",
    tone: "success",
  },
  {
    id: "sincronizar-tudo",
    title: "Sincronizar tudo",
    description: "Execute todas as verificações e atualizações necessárias.",
    hint: "Rodamos todas as etapas: cadastro, variações, conteúdo e estoque.",
    icon: "RefreshCw",
    tone: "primary",
  },
];

export const operationById = (id: OperationId) =>
  operations.find((operation) => operation.id === id) ?? operations[0]!;

export const skuExamples = {
  produto: "030402879",
  kit: "030402879145_030602815452",
};
