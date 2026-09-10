import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import {
  ArrowUp,
  Bot,
  ImageIcon,
  LoaderCircle,
  Package,
  PackageSearch,
  ShoppingBag,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { AppLayout } from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { type CopilotHistoryMessage, type CopilotKitDraft, sendCopilotMessage } from "@/lib/api";

export const Route = createFileRoute("/copiloto")({
  head: () => ({
    meta: [
      { title: "Copiloto IA | Puket Cadastro Inteligente" },
      { name: "description", content: "Converse com o copiloto e prepare operações interativas no catálogo Puket." },
    ],
  }),
  component: CopilotPage,
});

const suggestions = [
  { icon: PackageSearch, text: "Encontre produtos Stitch de praia que ainda não estão no Bling" },
  { icon: ShoppingBag, text: "Monte kits de mochila, lancheira e estojo da mesma coleção" },
  { icon: ImageIcon, text: "Mostre produtos sem imagens ou com variações incompletas" },
];

type ConversationMessage = CopilotHistoryMessage & { draft?: CopilotKitDraft | null };

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

function CopilotPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const hasConversation = messages.length > 0;

  const send = async (event?: FormEvent) => {
    event?.preventDefault();
    const value = input.trim();
    if (!value || loading) return;

    const history = messages.map(({ role, content }) => ({ role, content }));
    setMessages(current => [...current, { role: "user", content: value }]);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const result = await sendCopilotMessage(value, history);
      setMessages(current => [...current, { role: "assistant", content: result.resposta, draft: result.rascunhoKit }]);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Não foi possível consultar o copiloto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl flex-col">
        <header className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-[.18em] text-primary">
              <Sparkles className="h-4 w-4" /> Copiloto inteligente
            </div>
            <h1 className="mt-1 font-display text-3xl font-extrabold sm:text-5xl">O que vamos resolver?</h1>
            <p className="mt-1 text-muted-foreground">Peça em linguagem natural. Revise visualmente antes de executar.</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-grape/15 bg-grape-soft px-4 py-2 text-xs font-extrabold text-grape">
            <Bot className="h-4 w-4" /> DeepSeek Pro
          </span>
        </header>

        <section className="surface-card relative flex flex-1 flex-col overflow-hidden bg-card">
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-60 w-60 rounded-full bg-info/15 blur-2xl" />

          <div className="relative flex-1 overflow-y-auto p-4 sm:p-7">
            {!hasConversation ? (
              <div className="mx-auto flex min-h-[28rem] max-w-3xl flex-col items-center justify-center text-center">
                <span className="grid h-20 w-20 place-items-center rounded-[2rem] bg-primary text-primary-foreground shadow-float">
                  <WandSparkles className="h-9 w-9" />
                </span>
                <h2 className="mt-6 font-display text-3xl font-extrabold">Sua operação começa com um pedido</h2>
                <p className="mt-2 max-w-xl text-muted-foreground">Eu encontro produtos, cruzo catálogo, Linx e Bling e transformo o resultado em ferramentas para você selecionar e aprovar.</p>
                <div className="mt-8 grid w-full gap-3 md:grid-cols-3">
                  {suggestions.map(({ icon: Icon, text }) => (
                    <button key={text} type="button" onClick={() => setInput(text)} className="group rounded-3xl border bg-background/80 p-4 text-left transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-soft">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="mt-3 block text-sm font-bold leading-snug">{text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto max-w-4xl space-y-6">
                {messages.map((item, index) => item.role === "user" ? (
                  <div key={index} className="ml-auto max-w-2xl whitespace-pre-wrap rounded-[1.6rem] rounded-br-md bg-primary px-5 py-4 text-sm font-semibold text-primary-foreground shadow-soft">
                    {item.content}
                  </div>
                ) : (
                  <div key={index} className="flex items-start gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-grape-soft text-grape"><Bot className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="whitespace-pre-wrap rounded-[1.6rem] rounded-tl-md bg-secondary p-5 text-sm leading-relaxed">
                        {item.content}
                      </div>
                      {item.draft && (
                        <div className="mt-3 rounded-3xl border-2 border-grape/20 bg-card p-5 shadow-soft">
                          <div className="flex items-start gap-3">
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-grape-soft text-grape"><Package className="h-5 w-5" /></span>
                            <div>
                              <p className="text-xs font-extrabold uppercase tracking-[.14em] text-grape">Rascunho de kit</p>
                              <h3 className="mt-1 font-display text-xl font-extrabold">{item.draft.nome}</h3>
                            </div>
                          </div>
                          <div className="mt-4 space-y-2">
                            {item.draft.componentes.map(component => (
                              <div key={component.codigo} className="flex flex-col justify-between gap-1 rounded-2xl bg-secondary/60 px-4 py-3 text-sm sm:flex-row sm:items-center">
                                <div><p className="font-bold">{component.nome}</p><p className="font-mono text-xs text-muted-foreground">{component.codigo}</p></div>
                                <p className="font-extrabold">{component.quantidade}× · {currency.format(component.preco)}</p>
                              </div>
                            ))}
                          </div>
                          <div className="mt-4 flex flex-wrap gap-3 text-sm font-bold">
                            <span className="rounded-full bg-info-soft px-3 py-2">Disponível: {item.draft.disponibilidade}</span>
                            <span className="rounded-full bg-primary-soft px-3 py-2 text-primary">Preço: {currency.format(item.draft.preco)}</span>
                          </div>
                          <p className="mt-3 text-xs text-muted-foreground">Rascunho para revisão. Nada foi enviado ao Bling.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-grape-soft text-grape"><LoaderCircle className="h-5 w-5 animate-spin" /></span>
                    Consultando o DeepSeek e os dados do estoque...
                  </div>
                )}
                {error && <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-bold text-destructive">{error}</div>}
              </div>
            )}
          </div>

          <form onSubmit={send} className="relative border-t bg-card/95 p-3 backdrop-blur sm:p-5">
            <div className="mx-auto flex max-w-4xl items-end gap-2 rounded-[1.7rem] border bg-background p-2 pl-4 shadow-soft focus-within:border-primary/50">
              <textarea value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); send(); } }} rows={1} placeholder="Peça uma busca, análise ou automação..." className="max-h-32 min-h-11 flex-1 resize-none bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground" aria-label="Mensagem para o copiloto" />
              <Button type="submit" size="icon" disabled={!input.trim() || loading} className="h-11 w-11 shrink-0 rounded-2xl" aria-label="Enviar mensagem">{loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : <ArrowUp className="h-5 w-5" />}</Button>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">O copiloto prepara ações. Nenhuma alteração é enviada sem sua aprovação.</p>
          </form>
        </section>
      </div>
    </AppLayout>
  );
}
