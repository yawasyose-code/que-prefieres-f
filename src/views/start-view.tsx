import { Link } from "react-router-dom"
import { ArrowRight, Zap } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function StartView() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-10rem] bottom-[-10rem] h-80 w-80 rounded-full bg-sky-500/10 blur-[100px]"
      />

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <div className="animate-rise flex flex-col items-center gap-6">
          <span className="animate-rise inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-[0.7rem] font-medium tracking-widest text-muted-foreground uppercase backdrop-blur">
            <Zap className="size-3.5 text-primary" />
            El juego de decisiones imposibles
          </span>

          <h1
            className="animate-rise text-5xl font-extrabold tracking-tight text-balance sm:text-7xl"
            style={{ animationDelay: "60ms" }}
          >
            ¿Qué{" "}
            <span className="bg-gradient-to-r from-primary via-primary to-sky-400 bg-clip-text text-transparent">
              prefieres
            </span>
            ?
          </h1>

          <p
            className="animate-rise max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg"
            style={{ animationDelay: "120ms" }}
          >
            Dos opciones. Un solo voto. Sin escapatoria. Elije y descubre qué
            piensa el mundo de tu respuesta.
          </p>

          <div
            className="animate-rise flex flex-col items-center gap-3"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              to="/jugar"
              className={buttonVariants({ size: "lg", className: "h-12 rounded-xl px-8 text-base" })}
            >
              Comenzar a jugar
              <ArrowRight className="size-5" />
            </Link>
            <Link
              to="/historial"
              className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
            >
              Ver mi historial
            </Link>
          </div>
        </div>
      </main>

      <footer className="pb-6 text-center">
        <p className="text-xs text-muted-foreground/70">
          Hecho por <span className="font-medium text-muted-foreground">jph yawas</span>
        </p>
      </footer>
    </div>
  )
}