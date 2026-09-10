import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { operations } from "@/mocks/operations";

export interface HistoryFilterValues {
  query: string;
  period: string;
  operation: string;
  status: string;
}

export function HistoryFilters({
  values,
  onChange,
}: {
  values: HistoryFilterValues;
  onChange: (values: HistoryFilterValues) => void;
}) {
  const set = (patch: Partial<HistoryFilterValues>) => onChange({ ...values, ...patch });

  return (
    <div className="surface-card grid gap-4 p-4 sm:p-5 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
      <div className="min-w-0">
        <Label htmlFor="busca" className="text-xs font-bold">
          Buscar por SKU ou produto
        </Label>
        <div className="relative mt-1.5">
          <Search
            className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="busca"
            value={values.query}
            onChange={(event) => set({ query: event.target.value })}
            placeholder="Ex.: 030402879 ou Pijama"
            className="h-11 rounded-xl pl-9"
          />
        </div>
      </div>

      <div className="min-w-0">
        <Label htmlFor="periodo" className="text-xs font-bold">
          Período
        </Label>
        <Select value={values.period} onValueChange={(period) => set({ period })}>
          <SelectTrigger id="periodo" className="mt-1.5 h-11 w-full rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todo o período</SelectItem>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0">
        <Label htmlFor="operacao" className="text-xs font-bold">
          Operação
        </Label>
        <Select value={values.operation} onValueChange={(operation) => set({ operation })}>
          <SelectTrigger id="operacao" className="mt-1.5 h-11 w-full rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {operations.map((operation) => (
              <SelectItem key={operation.id} value={operation.id}>
                {operation.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-0">
        <Label htmlFor="status" className="text-xs font-bold">
          Status
        </Label>
        <Select value={values.status} onValueChange={(status) => set({ status })}>
          <SelectTrigger id="status" className="mt-1.5 h-11 w-full rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="concluido">Concluído</SelectItem>
            <SelectItem value="atencao">Concluído com atenção</SelectItem>
            <SelectItem value="erro">Erro</SelectItem>
            <SelectItem value="processando">Em processamento</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
