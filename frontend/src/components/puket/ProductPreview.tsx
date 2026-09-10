import { AlertTriangle, ArrowLeft, Check, ImageIcon, LoaderCircle, PackagePlus, ShieldCheck, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import type { Operation, ProductEdits, ProductPreviewData } from "@/types";
import { generateSeoDescription } from "@/lib/api";

const money = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const status = {
  existing: { label: "Já existe", className: "border-success/30 bg-success-soft text-success-foreground" },
  new: { label: "Será adicionada", className: "border-info/30 bg-info-soft text-info-foreground" },
  duplicate: { label: "Duplicidade", className: "border-destructive/30 bg-destructive-soft text-destructive" },
};

export function ProductPreview({ preview, operation, onBack, onApprove }: { preview: ProductPreviewData; operation: Operation; onBack: () => void; onApprove: (edits: ProductEdits) => void }) {
  const product = preview.product;
  const [edits, setEdits] = useState<ProductEdits>({ name: product.name, description: product.description, price: product.price, ncm: product.ncm, categoryId: product.categoryId, images: product.images, dimensions: { width: product.dimensions.width, height: product.dimensions.height, depth: product.dimensions.depth }, netWeight: product.dimensions.netWeight, grossWeight: product.dimensions.grossWeight });
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [descriptionError, setDescriptionError] = useState("");
  const changed = (field: keyof ProductEdits) => product.bling ? String(edits[field] ?? "") !== String(product.bling[field] ?? "") : true;
  const validNcm = /^[0-9.]{8,10}$/.test(edits.ncm.trim());
  const toggleImage = (url: string) => setEdits(value => ({ ...value, images: value.images.includes(url) ? value.images.filter(item => item !== url) : [...value.images, url] }));
  const makePrimary = (url: string) => setEdits(value => ({ ...value, images: [url, ...value.images.filter(item => item !== url)] }));
  const generateDescription = async () => {
    setGeneratingDescription(true);
    setDescriptionError("");
    try {
      const result = await generateSeoDescription({ nome: edits.name, descricaoCatalogo: product.catalogDescription, descricaoLinx: product.linxDescription, descricaoAtual: edits.description });
      setEdits(value => ({ ...value, description: result.descricao }));
    } catch (error) {
      setDescriptionError(error instanceof Error ? error.message : "Não foi possível gerar a descrição.");
    } finally {
      setGeneratingDescription(false);
    }
  };
  return <section className="surface-card mx-auto w-full max-w-4xl overflow-hidden motion-safe:animate-[pop-in_0.35s_ease-out_both]">
    <div className="border-b border-border bg-gradient-to-r from-primary-soft via-background to-accent/15 p-5 sm:p-7">
      <p className="text-xs font-extrabold uppercase tracking-[.16em] text-primary">{operation.title} · confira antes de enviar</p>
      <div className="mt-4 flex flex-col gap-5 sm:flex-row">
        <div className="grid aspect-square h-36 w-36 shrink-0 place-items-center overflow-hidden rounded-3xl border border-border bg-white shadow-sm">
          {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-contain p-2" /> : <PackagePlus className="h-12 w-12 text-muted-foreground" aria-hidden="true" />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-bold">SKU pai {product.parentSku}</span>
            <span className={`rounded-full border px-3 py-1 text-xs font-bold ${preview.parentExists ? "border-success/30 bg-success-soft text-success-foreground" : "border-info/30 bg-info-soft text-info-foreground"}`}>{preview.parentExists ? "Produto localizado no Bling" : "Novo produto"}</span>
          </div>
          <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{product.name}</h2>
          {product.description && <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>}
          <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            <div><dt className="text-muted-foreground">Preço</dt><dd className="font-bold">{money.format(product.price)}</dd></div>
            <div><dt className="text-muted-foreground">Marca</dt><dd className="font-bold">{product.brand}</dd></div>
            <div><dt className="text-muted-foreground">NCM</dt><dd className="font-mono font-bold">{product.ncm}</dd></div>
            <div><dt className="text-muted-foreground">Categoria</dt><dd className="font-mono font-bold">{product.categoryId}</dd></div>
          </dl>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border bg-secondary/25 p-4 sm:p-5"><h3 className="font-display text-lg font-bold">Medidas e peso</h3><p className="text-sm text-muted-foreground">{product.dimensions.detected ? 'Valores detectados na descrição. Confira antes de enviar.' : 'A descrição não trouxe medidas explícitas. Confira os valores sugeridos.'} Comprimento é enviado como profundidade.</p><div className="mt-4 grid gap-4 sm:grid-cols-3">{([['width','Largura (cm)'],['height','Altura (cm)'],['depth','Comprimento (cm)']] as const).map(([key,label]) => <div key={key}><Label htmlFor={`measure-${key}`}>{label}</Label><Input id={`measure-${key}`} type="number" min="0" step="0.01" className="mt-1.5 rounded-xl" value={edits.dimensions[key]} onChange={event => setEdits(value => ({...value, dimensions:{...value.dimensions,[key]:Number(event.target.value)}}))}/></div>)}<div><Label htmlFor="net-weight">Peso líquido (kg)</Label><Input id="net-weight" type="number" min="0" step="0.001" className="mt-1.5 rounded-xl" value={edits.netWeight} onChange={event => setEdits(value => ({...value,netWeight:Number(event.target.value)}))}/></div><div><Label htmlFor="gross-weight">Peso bruto (kg)</Label><Input id="gross-weight" type="number" min="0" step="0.001" className="mt-1.5 rounded-xl" value={edits.grossWeight} onChange={event => setEdits(value => ({...value,grossWeight:Number(event.target.value)}))}/></div></div></div>
    </div>

    <div className="p-5 sm:p-7">
      <div className="rounded-3xl border border-border bg-secondary/25 p-4 sm:p-5">
        <div className="flex flex-wrap items-end justify-between gap-2"><div><h3 className="font-display text-lg font-bold">Dados que serão enviados</h3><p className="text-sm text-muted-foreground">Edite o valor sugerido. Quando existir, o valor atual do Bling aparece abaixo.</p></div><span className="rounded-full bg-primary-soft px-3 py-1 text-xs font-bold text-primary">Campos alterados ficam destacados</span></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2"><Label htmlFor="preview-name">Nome do produto</Label><Input id="preview-name" className={`mt-1.5 h-11 rounded-xl ${changed('name') ? 'border-primary bg-primary-soft/30' : ''}`} value={edits.name} onChange={event => setEdits(value => ({ ...value, name: event.target.value }))} /><p className="mt-1 text-xs text-muted-foreground">Bling: {product.bling?.name || "Produto ainda não cadastrado"}</p></div>
          <div><Label htmlFor="preview-price">Preço</Label><Input id="preview-price" type="number" min="0" step="0.01" className={`mt-1.5 h-11 rounded-xl ${changed('price') ? 'border-primary bg-primary-soft/30' : ''}`} value={edits.price} onChange={event => setEdits(value => ({ ...value, price: Number(event.target.value) }))} /><p className="mt-1 text-xs font-semibold text-primary">{product.catalogPrice > 0 ? `Preço original do catálogo: ${money.format(product.catalogPrice)}` : `Preço do Linx: ${money.format(product.linxPrice)}`}</p><p className="mt-1 text-xs text-muted-foreground">Bling: {product.bling ? money.format(product.bling.price) : "Sem cadastro"}</p></div>
          <div><Label htmlFor="preview-ncm">NCM</Label><Input id="preview-ncm" className={`mt-1.5 h-11 rounded-xl font-mono ${changed('ncm') ? 'border-primary bg-primary-soft/30' : ''}`} value={edits.ncm} onChange={event => setEdits(value => ({ ...value, ncm: event.target.value }))} /><p className="mt-1 text-xs text-muted-foreground">Bling: {product.bling?.ncm || "Não informado"}</p></div>
          <div><Label htmlFor="preview-category">ID da categoria</Label><Input id="preview-category" type="number" min="1" className={`mt-1.5 h-11 rounded-xl font-mono ${changed('categoryId') ? 'border-primary bg-primary-soft/30' : ''}`} value={edits.categoryId} onChange={event => setEdits(value => ({ ...value, categoryId: Number(event.target.value) }))} /><p className="mt-1 text-xs text-muted-foreground">Bling: {product.bling?.categoryId || "Não informada"}</p></div>
          <div className="sm:col-span-2"><div className="flex flex-wrap items-center justify-between gap-2"><Label htmlFor="preview-description">Descrição</Label><Button type="button" size="sm" variant="outline" className="rounded-full border-grape/25 bg-grape-soft text-grape hover:bg-grape/15" disabled={generatingDescription || !edits.name.trim()} onClick={generateDescription}>{generatingDescription ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <WandSparkles className="h-4 w-4" />}{generatingDescription ? 'Gerando descrição...' : 'Gerar descrição SEO com IA'}</Button></div><Textarea id="preview-description" rows={10} className={`mt-1.5 rounded-xl ${changed('description') ? 'border-primary bg-primary-soft/30' : ''}`} value={edits.description} onChange={event => setEdits(value => ({ ...value, description: event.target.value }))} /><div className="mt-1 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-muted-foreground"><div className="flex flex-wrap gap-x-3"><span>{product.catalogDescription ? '✓ Catálogo Puket' : '– Catálogo sem descrição'}</span><span>{product.linxDescription ? '✓ Linx' : '– Linx sem descrição'}</span></div><span>{edits.description.length} caracteres</span></div>{descriptionError && <p className="mt-2 rounded-xl bg-destructive-soft px-3 py-2 text-xs font-bold text-destructive">{descriptionError}</p>}<p className="mt-1 line-clamp-2 text-xs text-muted-foreground">Bling: {product.bling?.description || "Descrição vazia"}</p></div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-border p-4 sm:p-5">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-info-soft text-info-foreground"><ImageIcon className="h-5 w-5" /></span><div><h3 className="font-display text-lg font-bold">Galeria do produto</h3><p className="text-sm text-muted-foreground">Marque as fotos que irão para o Bling e escolha a principal.</p></div></div>
        {product.images.length ? <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">{product.images.map(url => { const selected = edits.images.includes(url); const primary = edits.images[0] === url; return <article key={url} className={`overflow-hidden rounded-2xl border-2 bg-white ${selected ? 'border-primary' : 'border-border'}`}>
          <button type="button" className="relative block aspect-square w-full" onClick={() => toggleImage(url)}><img src={url} alt="Foto do produto" className="h-full w-full object-contain p-2" />{selected && <span className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></span>}</button>
          <div className="border-t border-border p-2"><Button type="button" size="sm" variant={primary ? 'default' : 'outline'} className="w-full rounded-full text-xs" disabled={!selected} onClick={() => makePrimary(url)}>{primary ? 'Imagem principal' : 'Tornar principal'}</Button></div>
        </article>; })}</div> : <div className="mt-4 rounded-2xl bg-secondary/50 p-5 text-center text-sm text-muted-foreground">Nenhuma imagem foi localizada nas fontes disponíveis.</div>}
        <p className="mt-3 text-xs font-semibold text-muted-foreground">{edits.images.length} de {product.images.length} imagem(ns) selecionada(s).</p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[['Variações', preview.summary.total], ['Já existem', preview.summary.existing], ['A adicionar', preview.summary.toCreate], ['Duplicidades', preview.summary.duplicates]].map(([label, value]) => <div key={label} className="rounded-2xl border border-border bg-secondary/45 p-3"><p className="text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl font-extrabold">{value}</p></div>)}
      </div>

      <div className="mt-6">
        <h3 className="font-display text-lg font-bold">Grade encontrada</h3>
        <div className="mt-3 max-h-80 space-y-2 overflow-y-auto pr-1">
          {preview.variations.map((item) => { const itemStatus = status[item.status]; return <article key={`${item.childSku}-${item.barcode}`} className="flex flex-col gap-3 rounded-2xl border border-border p-4 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1"><p className="truncate font-mono text-sm font-bold">{item.childSku}</p><p className="mt-1 text-xs text-muted-foreground">GTIN {item.barcode || "não informado"} · {item.colorName || "Sem cor"} · {item.size} · Estoque {item.stock}</p>{item.message && <p className="mt-1 text-xs font-semibold text-warning-foreground">{item.message}</p>}</div>
            <div className="flex items-center gap-3"><span className="font-bold">{money.format(item.price)}</span><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${itemStatus.className}`}>{itemStatus.label}</span></div>
          </article>; })}
        </div>
      </div>

      {preview.warnings.length > 0 && <div className="mt-5 rounded-2xl border border-destructive/30 bg-destructive-soft p-4 text-sm text-destructive"><p className="flex items-center gap-2 font-bold"><AlertTriangle className="h-4 w-4" />Revise antes de continuar</p><ul className="mt-2 space-y-1">{preview.warnings.map(item => <li key={item}>• {item}</li>)}</ul></div>}
      {preview.canApprove && <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-success-foreground"><ShieldCheck className="h-5 w-5" />Nenhuma alteração foi feita ainda. O envio só começa após sua confirmação.</p>}

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button variant="outline" className="h-12 rounded-full px-6" onClick={onBack}><ArrowLeft className="h-4 w-4" />Voltar e corrigir</Button>
        <Button className="h-12 rounded-full px-8 font-bold" onClick={() => onApprove(edits)} disabled={!preview.canApprove || !edits.name.trim() || edits.price < 0 || !validNcm || edits.categoryId < 1}>{preview.canApprove ? <><Check className="h-5 w-5" />Aceitar e adicionar ao Bling</> : <><AlertTriangle className="h-5 w-5" />Resolva as duplicidades</>}</Button>
      </div>
    </div>
  </section>;
}
