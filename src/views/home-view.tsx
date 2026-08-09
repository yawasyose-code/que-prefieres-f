import { useState } from "react"
import { Link } from "react-router-dom"
import {
  ArrowRight,
  History,
  Image as ImageIcon,
  Loader2,
  RefreshCw,
  Trophy,
} from "lucide-react"

import { AppLayout } from "@/components/layout"
import { ResultView } from "@/components/result-view"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
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
    <AppLayout>
      <div className="mx-auto flex h-full min-h-0 w-full max-w-7xl flex-1 flex-col">
        {view.kind === "loading" && (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <Card className="max-h-full w-full border-border/50 shadow-lg">
              <CardContent className="flex flex-col gap-3 p-4 sm:p-6">
                <Skeleton className="mx-auto h-5 w-1/3" />
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                  <Skeleton className="h-24 w-full sm:h-36 md:h-56 lg:h-100" />
                  <Skeleton className="h-24 w-full sm:h-36 md:h-56 lg:h-100" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {view.kind === "ready" && (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <Card className="max-h-full w-full border-border/50 shadow-lg">
              <CardHeader className="py-3 text-center sm:py-4">
                <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                  ¿Qué prefieres?
                </p>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6">
                <div className="relative">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
                    <ChoiceCard
                      choice="A"
                      text={view.question.option_a}
                      image={view.question.image_url_a}
                      disabled={voteMutation.isPending}
                      onClick={() => handleVote("A")}
                    />
                    <div className="flex items-center justify-center gap-3 text-xs font-semibold text-muted-foreground md:hidden">
                      <span className="h-px flex-1 bg-border" />
                      O
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <ChoiceCard
                      choice="B"
                      text={view.question.option_b}
                      image={view.question.image_url_b}
                      disabled={voteMutation.isPending}
                      onClick={() => handleVote("B")}
                    />
                  </div>
                  <span className="pointer-events-none absolute top-1/2 left-1/2 z-10 hidden size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-sm font-extrabold tracking-wide text-foreground shadow-xl md:flex">
                    VS
                  </span>
                </div>
              </CardContent>
              {voteMutation.isPending && (
                <CardFooter className="justify-center py-3 text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" /> Registrando tu
                  voto…
                </CardFooter>
              )}
            </Card>
          </div>
        )}

        {view.kind === "voted" && (
          <Card className="max-h-full w-full border-border/50 shadow-lg">
            <CardHeader className="flex flex-col items-center gap-1 py-3 text-center sm:py-4">
              <p className="text-xs font-medium tracking-widest text-muted-foreground uppercase">
                Resultado
              </p>
              <p className="text-sm text-muted-foreground">
                {view.question.total_votes.toLocaleString()} votos en total
              </p>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6">
              <div className="relative">
                <ResultView question={view.question} />
                <span className="pointer-events-none absolute top-1/2 left-1/2 z-10 hidden size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background text-sm font-extrabold tracking-wide text-foreground shadow-xl md:flex">
                  VS
                </span>
              </div>
            </CardContent>
            <CardFooter className="justify-center py-3">
              <Button onClick={() => void handleNext()}>
                <RefreshCw className="size-4" />
                Siguiente pregunta
              </Button>
            </CardFooter>
          </Card>
        )}

        {view.kind === "finished" && (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
            <Card className="max-h-full w-full border-border/50 shadow-lg">
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
          <Card className="border-border/50 shadow-lg">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-lg font-semibold">Algo salió mal</p>
              <p className="text-sm text-muted-foreground">{view.message}</p>
              <Button onClick={() => void handleNext()}>Reintentar</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}

function ChoiceCard({
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
  const isA = choice === "A"
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-2xl border bg-card text-left transition-all duration-200",
        isA
          ? "border-sky-500/25 hover:border-sky-500/70 hover:shadow-[0_8px_40px_-12px_rgba(56,189,248,0.35)]"
          : "border-rose-500/25 hover:border-rose-500/70 hover:shadow-[0_8px_40px_-12px_rgba(244,63,94,0.35)]",
        disabled && "cursor-wait opacity-70"
      )}
    >
      <div className="relative h-24 w-full shrink-0 overflow-hidden sm:h-36 md:h-56 lg:h-100">
        {image ? (
          <img
            src={image}
            alt={text}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className={cn(
              "flex size-full items-center justify-center transition-transform duration-500 group-hover:scale-105",
              isA
                ? "bg-gradient-to-br from-sky-500/25 via-sky-500/10 to-transparent"
                : "bg-gradient-to-br from-rose-500/25 via-rose-500/10 to-transparent"
            )}
          >
            <ImageIcon className="size-8 text-muted-foreground/40 sm:size-10" />
          </div>
        )}
        <span
          className={cn(
            "absolute top-3 left-3 flex size-7 items-center justify-center rounded-lg text-sm font-extrabold text-white shadow-lg transition-transform duration-200 group-hover:scale-110 sm:size-11 sm:text-lg",
            isA ? "bg-sky-500" : "bg-rose-500"
          )}
        >
          {choice}
        </span>
      </div>
      <div className="flex flex-1 items-center justify-between gap-3 p-4 sm:p-5">
        <span className="line-clamp-2 text-sm leading-snug font-semibold text-balance md:text-lg">
          {text}
        </span>
        <span
          className={cn(
            "flex size-7 shrink-0 items-center justify-center rounded-full border transition-all duration-200 group-hover:translate-x-1 sm:size-8",
            isA
              ? "border-sky-500/30 text-sky-400 group-hover:bg-sky-500 group-hover:text-white"
              : "border-rose-500/30 text-rose-400 group-hover:bg-rose-500 group-hover:text-white"
          )}
        >
          <ArrowRight className="size-4" />
        </span>
      </div>
    </button>
  )
}
