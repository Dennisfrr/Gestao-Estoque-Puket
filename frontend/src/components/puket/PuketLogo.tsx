/**
 * ATENÇÃO: wordmark temporário.
 * Substituir por src/assets/puket-logo.svg (arquivo oficial da marca)
 * assim que ele estiver disponível no projeto.
 */
export function PuketLogo({ className = "" }: { className?: string }) {
  return (
    <span
      data-placeholder-logo="substituir-pelo-arquivo-oficial-da-puket"
      className={`font-display text-2xl leading-none font-extrabold tracking-tight text-primary lowercase ${className}`}
    >
      puket
      <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-accent align-super" />
    </span>
  );
}
