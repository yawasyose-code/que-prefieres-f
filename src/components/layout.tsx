import { Link } from "react-router-dom"
import { History, Play } from "lucide-react"

import { cn } from "@/lib/utils"

export function AppLayout({
  children,
  fullBleed = false,
}: {
  children: React.ReactNode
  fullBleed?: boolean
}) {
  return (
    <div
      className={cn(
        "flex flex-col bg-background",
        fullBleed ? "h-svh overflow-hidden" : "min-h-svh"
      )}
    >
      <header className="sticky top-0 z-20 shrink-0 border-b border-border/50 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-12 w-full max-w-7xl items-center justify-between px-4 sm:h-14">
          <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              ¿
            </span>
            Qué prefieres
          </Link>
          <nav className="flex items-center gap-1">
            <Link
              to="/jugar"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Play className="size-4" />
              Jugar
            </Link>
            <Link
              to="/historial"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <History className="size-4" />
              Historial
            </Link>
          </nav>
        </div>
      </header>
      <main
        className={cn(
          "mx-auto flex w-full max-w-7xl flex-1 flex-col",
          fullBleed ? "min-h-0 overflow-hidden" : "px-4 py-6"
        )}
      >
        {children}
      </main>
    </div>
  )
}
