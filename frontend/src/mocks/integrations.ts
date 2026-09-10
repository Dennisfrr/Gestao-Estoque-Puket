import type { IntegrationStatus } from "@/types";

export const integrations: IntegrationStatus[] = [
  {
    id: "linx",
    name: "Linx",
    icon: "Database",
    state: "operacional",
    lastCheck: "há 2 minutos",
    description: "Origem dos produtos, grades e saldos de estoque.",
  },
  {
    id: "bling",
    name: "Bling",
    icon: "PackageSearch",
    state: "instavel",
    lastCheck: "há 5 minutos",
    description: "Destino dos cadastros de produtos, variações e kits.",
  },
  {
    id: "backend",
    name: "Backend",
    icon: "Server",
    state: "manutencao",
    lastCheck: "há 12 minutos",
    description: "Serviço que orquestra as automações de cadastro.",
  },
  {
    id: "catalogo",
    name: "Catálogo Puket",
    icon: "BookOpen",
    state: "operacional",
    lastCheck: "há 1 minuto",
    description: "Nomes, descrições e atributos oficiais dos produtos.",
  },
  {
    id: "imagens",
    name: "Serviço de imagens",
    icon: "Image",
    state: "offline",
    lastCheck: "há 27 minutos",
    description: "Banco de fotos usado para enriquecer os cadastros.",
  },
];
