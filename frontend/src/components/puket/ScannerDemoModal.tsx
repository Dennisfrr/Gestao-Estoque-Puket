import { Keyboard, ScanLine, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ScannerDemoModal({
  open,
  onOpenChange,
  onTypeInstead,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTypeInstead: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto rounded-3xl sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display">Leitura por câmera</DialogTitle>
          <DialogDescription>
            Demonstração visual: nenhuma câmera é acessada nesta etapa.
          </DialogDescription>
        </DialogHeader>

        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
          <div className="absolute inset-0 grid place-items-center text-muted-foreground">
            <ScanLine className="h-10 w-10" aria-hidden="true" />
          </div>
          <div className="absolute inset-6 rounded-2xl border-4 border-primary/70" />
          <div className="absolute inset-x-6 top-1/2 h-1 rounded-full bg-primary/70 motion-safe:animate-pulse" />
        </div>

        <p className="text-center text-sm font-semibold">Posicione o código dentro da área</p>

        <DialogFooter className="gap-2 sm:justify-between">
          <Button variant="outline" className="rounded-full" onClick={() => onOpenChange(false)}>
            <X className="h-4 w-4" aria-hidden="true" />
            Fechar
          </Button>
          <Button className="rounded-full" onClick={onTypeInstead}>
            <Keyboard className="h-4 w-4" aria-hidden="true" />
            Digitar código
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
