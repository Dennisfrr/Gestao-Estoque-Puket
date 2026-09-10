# Puket Magic Box

Crie somente o frontend e o design de um sistema interno chamado “Puket Cadastro Inteligente”.

Não implemente backend, banco de dados, Supabase, Lovable Functions, Edge Functions, autenticação real ou integrações com APIs. Não tente conectar Linx, Bling ou Railway. Essas integrações serão desenvolvidas posteriormente pela nossa equipe.

O objetivo desta etapa é entregar uma interface visual completa, responsiva e bem organizada, utilizando dados locais de demonstração.

OBJETIVO DO SISTEMA

O sistema será usado pela equipe da Puket para automatizar a criação e atualização de produtos, variações e kits.

O usuário terá um fluxo extremamente simples:

Escolher a operação.

Digitar ou escanear um SKU.

Clicar em executar.

Acompanhar o processamento.

Visualizar o resultado.

A interface não deve apresentar formulários complexos para nome, preço, cor, tamanho, descrição, imagens, NCM ou categoria. Futuramente, essas informações serão obtidas automaticamente pelo backend.

IDENTIDADE VISUAL

Crie uma interface inspirada no branding da Puket:

Alegre.

Colorida.

Acolhedora.

Divertida.

Moderna.

Leve.

Fácil de usar.

Utilize como referência visual:

Rosa vibrante como cor principal.

Amarelo alegre para destaques.

Turquesa para informações.

Roxo como cor complementar.

Branco e rosa muito claro nos fundos.

Cards brancos com cantos arredondados.

Sombras suaves.

Ícones arredondados.

Tipografia moderna, legível e levemente arredondada.

Pequenos círculos, gotas e formas orgânicas coloridas.

Animações sutis e agradáveis.

A interface deve transmitir a sensação:

“Uma ferramenta Puket: colorida, simples, rápida e gostosa de usar.”

Evite:

Aparência infantil excessiva.

Excesso de cores na mesma área.

Gradientes genéricos de aplicativos de IA.

Interface escura.

Visual corporativo cinza e frio.

Excesso de informações técnicas.

Layout parecido com painel administrativo genérico.

Tabelas grandes na página principal.

Use bastante espaço em branco e destaque uma ação principal por vez.

LOGOTIPO E MARCA

Reserve no cabeçalho um espaço para o logotipo da Puket.

Se não houver um arquivo oficial disponível no projeto, use temporariamente um wordmark textual “puket” com aparência arredondada e identifique claramente no código que ele deverá ser substituído pelo arquivo oficial.

Não invente ou redesenhe um novo logotipo oficial.

ESTRUTURA GERAL

Crie uma barra lateral compacta no desktop com:

Automatizar

Histórico

Status

Configurações

No celular, transforme essa barra em navegação inferior.

No topo, mostre:

Logotipo Puket.

Nome “Cadastro Inteligente”.

Nome do usuário de demonstração.

Avatar.

Botão de notificações.

PÁGINA: AUTOMATIZAR

A tela inicial deve ter uma recepção amigável:

“Olá! O que vamos automatizar hoje?”

Abaixo, mostre a frase:

“Escolha uma operação e informe o SKU. O sistema cuida do restante.”

Apresente as operações em cards selecionáveis:

Cadastrar produto e variações
Ícone relacionado a produto.
Texto: “Crie o produto-pai com todas as suas cores e tamanhos.”

Adicionar variações ausentes
Ícone relacionado a grade ou tamanhos.
Texto: “Encontre e adicione somente as variações que estiverem faltando.”

Criar kit
Ícone de caixa ou presente.
Texto: “Monte automaticamente o kit e sua composição.”

Atualizar estoque
Ícone de caixas ou inventário.
Texto: “Sincronize o saldo de todas as variações.”

Atualizar conteúdo
Ícone de imagem ou brilho.
Texto: “Atualize imagens, nome e descrição do produto.”

Verificar cadastro
Ícone de lupa ou verificação.
Texto: “Confira se o cadastro está completo e correto.”

Sincronizar tudo
Ícone de sincronização.
Texto: “Execute todas as verificações e atualizações necessárias.”

Selecione visualmente uma operação por vez. O card selecionado deve ganhar borda rosa, fundo levemente colorido e indicador de seleção.

ENTRADA DO SKU

Depois que o usuário escolher uma operação, mostre um card central com:

Nome da operação selecionada.

Explicação curta.

Campo grande para SKU.

Ícone de código de barras.

Botão para leitura por câmera.

Botão principal “Executar automação”.

Link discreto “Trocar operação”.

Placeholder do campo:

“Digite ou escaneie o SKU”

Inclua exemplos visuais:

Produto: 030402879

Kit: 030402879145_030602815452

O campo deve:

Ter bastante destaque.

Ser confortável para uso com leitor de código de barras.

Permitir execução visual ao pressionar Enter.

Mostrar estado vazio, preenchido, inválido e válido.

Ficar bem apresentado no celular.

Não precisa implementar leitura real pela câmera. O botão pode abrir um modal visual demonstrativo.

MODAL DE LEITURA

Crie um modal simulando a leitura de código de barras:

Área visual da câmera.

Moldura de leitura.

Instrução “Posicione o código dentro da área”.

Botão “Digitar código”.

Botão para fechar.

Não solicite acesso real à câmera nesta etapa.

TELA DE PROCESSAMENTO

Ao executar, mostre uma experiência visual de progresso usando dados simulados.

Etapas:

Conectando ao Linx

Buscando produto

Identificando produto-pai

Encontrando cores e tamanhos

Consultando Bling

Comparando cadastros

Criando ou atualizando

Sincronizando estoque

Finalizando

Cada etapa deve possuir estados visuais:

Aguardando.

Em andamento.

Concluída.

Aviso.

Erro.

Use ícones e textos, não apenas cores.

Inclua:

Barra de progresso.

Nome do SKU.

Operação selecionada.

Tempo decorrido de demonstração.

Mensagem “Você pode acompanhar cada etapa por aqui”.

Adicione uma animação sutil e divertida, coerente com a Puket, sem prejudicar a legibilidade.

RESULTADO DE SUCESSO

Crie uma tela de resultado com:

Título:

“Tudo pronto!”

Mensagem:

“O produto foi processado com sucesso.”

Cards de resumo:

Produto-pai localizado ou criado.

Variações encontradas.

Variações criadas.

Estoques atualizados.

Imagens adicionadas.

Tempo de processamento.

Mostre um exemplo visual:

SKU: 030402879

Produto: Pijama Manga Longa

8 variações encontradas

3 variações criadas

8 saldos atualizados

5 imagens adicionadas

Inclua os botões:

Executar outra operação.

Ver detalhes.

Copiar relatório.

RESULTADO COM AVISO

Crie um estado em que a operação foi concluída parcialmente:

Título:

“Concluído com atenção”

Exemplo:

“O produto foi atualizado, mas uma variação precisa de revisão.”

Mostre claramente:

O que foi concluído.

O que precisa ser revisto.

Qual SKU apresentou problema.

Botão “Ver pendência”.

Botão “Executar novamente”.

RESULTADO COM ERRO

Crie uma tela de erro amigável:

Título:

“Não conseguimos concluir”

Exemplo:

“O produto não foi encontrado na Linx.”

Inclua:

Etapa em que ocorreu o erro.

Explicação simples.

Sugestão do que conferir.

Botão “Corrigir SKU”.

Botão “Tentar novamente”.

Botão “Voltar ao início”.

Evite mensagens técnicas ou códigos incompreensíveis.

PÁGINA: HISTÓRICO

Crie uma página de histórico visual contendo:

Data e hora.

Operação.

SKU.

Produto.

Usuário.

Status.

Duração.

Botão para visualizar detalhes.

Filtros:

Busca por SKU ou produto.

Período.

Tipo de operação.

Status.

Status disponíveis:

Concluído.

Concluído com atenção.

Erro.

Em processamento.

No desktop, pode utilizar uma tabela moderna e leve.

No celular, transforme cada registro em um card.

Crie um painel lateral ou modal com os detalhes de uma operação ao clicar em um registro.

PÁGINA: STATUS

Crie uma página visual para apresentar:

Linx.

Bling.

Backend.

Catálogo Puket.

Serviço de imagens.

Cada integração deve possuir:

Nome.

Ícone.

Estado visual.

Última verificação.

Pequena descrição.

Use dados exclusivamente simulados.

Adicione um aviso visível:

“Status demonstrativo — as integrações serão conectadas posteriormente.”

PÁGINA: CONFIGURAÇÕES

Crie apenas a interface visual para:

Preferências de aparência.

Confirmação antes de executar.

Sons de conclusão.

Notificações.

Operação padrão.

Modo compacto.

Não implemente configurações reais de API, tokens ou credenciais.

DADOS DE DEMONSTRAÇÃO

Crie dados locais mockados em arquivos separados.

Mostre permanentemente um pequeno selo:

“Modo demonstração”

Não simule chamadas de rede e não apresente dados de demonstração como se fossem reais.

Os botões podem navegar entre os estados simulados:

Processando.

Sucesso.

Aviso.

Erro.

Inclua uma maneira simples, apenas durante o desenvolvimento, de alternar o resultado demonstrado.

RESPONSIVIDADE

A interface deve funcionar perfeitamente em:

Computador.

Tablet.

Celular.

No celular:

Navegação inferior.

Cards empilhados.

Campo de SKU em destaque.

Botão principal ocupando toda a largura.

Áreas de toque confortáveis.

Histórico apresentado em cards.

Modais adaptados à altura da tela.

ACESSIBILIDADE

Contraste adequado.

Foco visível pelo teclado.

Labels associados aos campos.

Ícones acompanhados por texto ou descrição.

Estados não identificados apenas por cor.

Respeitar preferência por redução de movimento.

Botões com tamanho confortável.

Português do Brasil em toda a interface.

TECNOLOGIA E ORGANIZAÇÃO

Use React e TypeScript.

Crie componentes reutilizáveis:

AppSidebar

MobileNavigation

AppHeader

OperationCard

OperationSelector

SkuInput

ScannerDemoModal

AutomationProgress

ProgressStep

AutomationResult

ResultMetric

HistoryList

HistoryFilters

HistoryDetails

IntegrationStatusCard

DemoModeBadge

EmptyState

ErrorState

Organize o frontend em:

pages

components

layouts

types

mocks

styles

Não crie serviços de API nesta etapa.

Não implemente regras de negócio.

Não coloque credenciais no código.

Não crie banco de dados.

Não crie Supabase.

Não crie backend.

ENTREGA

Entregue uma experiência visual completa e navegável contendo:

Página de automação.

Seleção de operações.

Entrada de SKU.

Modal demonstrativo de scanner.

Processamento simulado.

Resultado de sucesso.

Resultado com aviso.

Resultado de erro.

Histórico demonstrativo.

Status demonstrativo.

Configurações visuais.

Layout responsivo.

Identidade visual inspirada na Puket.

Componentes organizados para receber a integração real posteriormente.

Priorize clareza, velocidade e facilidade de uso. O usuário deve entender a interface imediatamente e conseguir iniciar uma operação em poucos segundos.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c3c10f59-dd33-4cb4-9fd5-6bbbee7e7995).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
