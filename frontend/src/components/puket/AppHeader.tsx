import { Bell } from "lucide-react";
import { DemoModeBadge } from "./DemoModeBadge";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <DemoModeBadge />
        <button
          type="button"
          className="relative grid h-11 w-11 place-items-center rounded-full bg-card text-muted-foreground shadow-soft"
          aria-label="3 notificações"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-extrabold text-primary-foreground">
            3
          </span>
        </button>
      </div>
    </header>
  );
}
