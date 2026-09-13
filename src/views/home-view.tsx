import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  History,
  Loader2,
  RefreshCw,
  Trophy,
} from "lucide-react"

import { AppLayout } from "@/components/layout"
import { ResultView } from "@/components/result-view"
import { ChoiceBadge, DuelMedia } from "@/components/duel-panel"
import { choiceAccent } from "@/lib/choice-accent"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  isConflict,
  isNoMoreQuestions,
  useRandomQuestion,
  useVote,
} from "@/lib/hooks"
import { cn } from "@/lib/utils"
import type { QuestionResponse, VoteChoice } from "@/lib/types"

type State =
  | { kind: "loading" }
  | { kind: "ready"; question: QuestionResponse }
  | { kind: "voted"; question: QuestionResponse }
  | { kind: "finished" }
  | { kind: "error"; message: string }

export function HomeView() {
  const [state, setState] = useState<State>({ kind: "loading" })
  const voteMutation = useVote()

  const { data, error, refetch, isPending, isFetching } = useRandomQuestion()

  let view: State
  if (state.kind === "error") {
    view = state
  } else if (state.kind === "voted") {
    view = state
  } else if (state.kind === "finished") {
    view = state
  } else if (isNoMoreQuestions(error)) {
    view = { kind: "finished" }
  } else if (error) {
    view = { kind: "error", message: error.message }
  } else if (isPending || isFetching) {
    view = { kind: "loading" }
  } else if (data?.user_choice) {
    view = { kind: "voted", question: data }
  } else if (data) {
    view = { kind: "ready", question: data }
  } else {
    view = { kind: "loading" }
  }

  const handleVote = (choice: VoteChoice) => {
    if (!data) return
    voteMutation.mutate(
      { id: data.id, choice },
      {
        onSuccess: (question) => setState({ kind: "voted", question }),
        onError: (err) => {
          if (isConflict(err)) {
            setState({ kind: "voted", question: data })
          } else {
            setState({ kind: "error", message: err.message })
          }
        },
      }
    )
  }

  const handleNext = async () => {
    setState({ kind: "loading" })
    voteMutation.reset()
    const result = await refetch()
    if (result.data) {
      setState(
        result.data.user_choice
          ? { kind: "voted", question: result.data }
          : { kind: "ready", question: result.data }
      )
    } else if (isNoMoreQuestions(result.error)) {
      setState({ kind: "finished" })
    } else {
      setState({ kind: "error", message: result.error?.message ?? "Error" })
    }
  }

  return (
    <AppLayout fullBleed>
      <div className="flex min-h-0 flex-1 flex-col">
        {view.kind === "loading" && <DuelSkeleton />}

        {view.kind === "ready" && (
          <DuelStage key={view.question.id}>
            <ChoicePanel
              choice="A"
              text={view.question.option_a}
              image={view.question.image_url_a}
              disabled={voteMutation.isPending}
              onClick={() => handleVote("A")}
            />
            <ChoicePanel
              choice="B"
              text={view.question.option_b}
              image={view.question.image_url_b}
              disabled={voteMutation.isPending}
              onClick={() => handleVote("B")}
            />
            <VsBadge />
            {voteMutation.isPending && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/30 backdrop-blur-[2px]">
                <div className="flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium shadow-xl">
                  <Loader2 className="size-4 animate-spin" />
                  Registrando tu voto…
                </div>
              </div>
            )}
          </DuelStage>
        )}

        {view.kind === "voted" && (
          <DuelStage key={`result-${view.question.id}`}>
            <ResultView question={view.question} />
            <VsBadge />
            <span className="absolute top-4 left-1/2 z-10 -translate-x-1/2 rounded-full border border-border/50 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-lg backdrop-blur tabular-nums">
              {view.question.total_votes.toLocaleString()} votos en total
            </span>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-[max(1.5rem,env(safe-area-inset-bottom))]">
              <Button
                size="lg"
                onClick={() => void handleNext()}
                className="pointer-events-auto rounded-full shadow-xl"
              >
                <RefreshCw className="size-4" />
                Siguiente pregunta
              </Button>
            </div>
          </DuelStage>
        )}

        {view.kind === "finished" && (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
            <Card className="w-full max-w-md border-border/50 shadow-lg">
              <CardContent className="flex flex-col items-center gap-5 px-6 py-12 text-center">
                <span className="flex size-20 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                  <Trophy className="size-10" />
                </span>
                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                    ¡Cacería completada!
                  </h2>
                  <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                    Respondiste todas las preguntas disponibles. Vuelve pronto
                    para más duelos.
                  </p>
                </div>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <Link to="/historial" className={buttonVariants()}>
                    <History className="size-4" />
                    Ver mi historial
                  </Link>
                  <Link
                    to="/"
                    className={buttonVariants({ variant: "outline" })}
                  >
                    Volver a inicio
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {view.kind === "error" && (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center px-4">
            <Card className="w-full max-w-md border-border/50 shadow-lg">
              <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                <p className="text-lg font-semibold">Algo salió mal</p>
                <p className="text-sm text-muted-foreground">{view.message}</p>
                <Button onClick={() => void handleNext()}>Reintentar</Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

/** Grid a pantalla dividida: 2 filas en móvil, 2 columnas en desktop. */
function DuelStage({ children }: { children: React.ReactNode }) {
  return (
    <div className="animate-rise relative grid min-h-0 flex-1 grid-rows-2 pb-[env(safe-area-inset-bottom)] md:grid-cols-2 md:grid-rows-1">
      {children}
    </div>
  )
}

function VsBadge() {
  return (
    <span className="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
      <span className="absolute inset-0 animate-ping rounded-full bg-foreground/15 [animation-duration:2.5s]" />
      <span className="relative flex size-12 items-center justify-center rounded-full border-2 border-background bg-foreground text-sm font-black tracking-wide text-background shadow-2xl sm:size-14 sm:text-base">
        VS
      </span>
    </span>
  )
}

function DuelSkeleton() {
  return (
    <div className="grid min-h-0 flex-1 grid-rows-2 md:grid-cols-2 md:grid-rows-1">
      <Skeleton className="rounded-none" />
      <Skeleton className="rounded-none" />
    </div>
  )
}

function ChoicePanel({
  choice,
  text,
  image,
  disabled,
  onClick,
}: {
  choice: VoteChoice
  text: string
  image?: string | null
  disabled?: boolean
  onClick: () => void
}) {
  const accent = choiceAccent(choice)

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative min-h-0 overflow-hidden text-left outline-none",
        disabled && "cursor-wait"
      )}
    >
      <DuelMedia
        image={image}
        alt={text}
        choice={choice}
        className="transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Tinte de color al hacer hover */}
      <div
        className={cn(
          "absolute inset-0 transition-colors duration-300",
          accent.washHover
        )}
      />

      {/* Borde de foco/hover */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 border-4 border-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100",
          accent.borderHover
        )}
      />

      <ChoiceBadge
        choice={choice}
        className="absolute top-4 left-4 transition-transform duration-300 group-hover:scale-110"
      />

      {/* Texto en overlay inferior */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-16 sm:p-6 sm:pt-20 md:p-8 md:pt-24">
        <span
          className={cn(
            "text-xs font-bold tracking-widest uppercase",
            accent.textSoft
          )}
        >
          Opción {choice}
        </span>
        <span className="line-clamp-3 text-xl leading-tight font-extrabold text-balance text-white sm:text-2xl md:text-3xl">
          {text}
        </span>
        <span className="mt-1 flex items-center gap-1.5 text-xs font-medium text-white/60 transition-colors duration-300 group-hover:text-white sm:text-sm">
          Toca para elegir
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </div>
    </button>
  )
}
