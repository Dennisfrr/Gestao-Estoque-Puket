import type { ReactNode } from "react";
import { AppHeader } from "@/components/puket/AppHeader";
import { AppSidebar } from "@/components/puket/AppSidebar";
import { MobileNavigation } from "@/components/puket/MobileNavigation";
export function AppLayout({ children }: { children: ReactNode }) { return <div className="min-h-screen"><AppSidebar /><div className="lg:pl-64"><AppHeader /><main className="mx-auto max-w-7xl px-4 pb-28 pt-8 sm:px-6 lg:px-8 lg:pb-12">{children}</main></div><MobileNavigation /></div>; }
