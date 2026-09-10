# Gestão de Estoque Puket

Plataforma interna para automatizar o cadastro e a manutenção de produtos da Puket. O sistema conecta dados do Linx e do catálogo interno ao Bling, reduzindo o trabalho manual na criação de produtos, variações e kits.

## Principais recursos

- Cadastro sob demanda de vários SKUs.
- Criação de produto-pai e variações de cor e tamanho.
- Detecção e inclusão de variações ausentes.
- Criação de kits com componentes existentes ou criados automaticamente.
- Consulta e importação do catálogo interno.
- Sincronização de estoque entre Linx e Bling.
- Importação de imagens e descrições do catálogo.
- Geração assistida de descrições SEO com IA.
- Pré-visualização e aprovação antes do envio ao Bling.
- Histórico das automações e painel de status das integrações.
- Copiloto para consultas em linguagem natural.

## Estrutura

```text
backend/   API Node.js, autenticação e integrações
frontend/  Dashboard React/TanStack hospedada pelo Lovable
```

Fluxo principal:

```text
Linx + Catálogo interno -> Backend -> Revisão no dashboard -> Bling
```

O frontend nunca recebe as credenciais das integrações. Tokens e senhas permanecem somente no arquivo `.env` do backend ou no gerenciador de segredos da hospedagem.

## Requisitos

- Node.js 20 ou superior
- npm
- Credenciais autorizadas do Linx, Bling e DeepSeek
- Cloudflare Tunnel para expor o backend local ao frontend publicado

## Configuração do backend

```bash
cd backend
npm install
```

Copie `backend/.env.example` para `backend/.env` e preencha as variáveis necessárias. O arquivo `.env` não deve ser versionado.

Para iniciar localmente:

```bash
npm start
```

Para usar a configuração destinada ao Cloudflare Tunnel:

```bash
npm run start:tunnel
```

Por padrão, o backend atende em `http://localhost:3030`.

## Configuração do frontend

```bash
cd frontend
npm install
npm run dev
```

Configure `VITE_API_URL` com a URL pública HTTPS do backend. Para gerar uma versão de produção:

```bash
npm run build
```

## Uso com o site publicado

O frontend publicado continua disponível no Lovable. No computador que executa as integrações, mantenha:

1. O serviço `Cloudflared` em execução.
2. O backend iniciado com `npm run start:tunnel`.

O túnel permanente encaminha a URL pública do backend para a porta local `3030`.

## Segurança

- Nunca envie `.env`, tokens OAuth, senhas ou arquivos de sessão ao Git.
- Revogue imediatamente qualquer token exposto em conversa, captura de tela ou log.
- Mantenha o repositório privado porque ele descreve integrações internas.
- Revise as alterações apresentadas no dashboard antes de gravá-las no Bling.
- Restrinja `ALLOWED_ORIGINS` aos endereços oficiais do frontend.

## Situação do projeto

Projeto interno em evolução. A próxima frente planejada é a área de saúde dos cadastros, destinada a localizar produtos incompletos, kits ou variações quebradas e falhas de integração com marketplaces.

