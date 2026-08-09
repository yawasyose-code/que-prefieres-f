import { Check, Crown, History, Image as ImageIcon } from "lucide-react"

import { AppLayout } from "@/components/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { useHistory } from "@/lib/hooks"
import { cn } from "@/lib/utils"
import type { HistoryItem, VoteChoice } from "@/lib/types"

export function HistoryView() {
  const history = useHistory()

  return (
    <AppLayout>
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <History className="size-5 text-muted-foreground" />
            <h1 className="text-lg font-semibold text-foreground">Tu historial</h1>
          </div>
          {!history.isLoading && !history.error && (
            <p className="text-sm text-muted-foreground">
              Has respondido {history.data?.length ?? 0} duelos
            </p>
          )}
        </div>

        {history.isLoading && <HistoryListSkeleton />}

        {history.error && (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              No pudimos cargar tu historial. Reintenta en un momento.
            </CardContent>
          </Card>
        )}

        {!history.isLoading && !history.error && history.data?.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-sm text-muted-foreground">
              Todavía no has votado ninguna pregunta. ¡Juega y vuelve!
            </CardContent>
          </Card>
        )}

        {!history.isLoading &&
          !history.error &&
          (history.data?.length ?? 0) > 0 && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {history.data!.map((item) => (
                <DuelCard key={item.question_id} item={item} />
              ))}
            </div>
          )}
      </div>
    </AppLayout>
  )
}

function DuelCard({ item }: { item: HistoryItem }) {
  const winner: VoteChoice | null =
    item.percentage_a === item.percentage_b
      ? null
      : item.percentage_a > item.percentage_b
        ? "A"
        : "B"

  const rows: {
    choice: VoteChoice
    option: string
    votes: number
    percentage: number
    image?: string | null
  }[] = [
    {
      choice: "A",
      option: item.option_a,
      votes: item.votes_a,
      percentage: item.percentage_a,
      image: item.image_url_a,
    },
    {
      choice: "B",
      option: item.option_b,
      votes: item.votes_b,
      percentage: item.percentage_b,
      image: item.image_url_b,
    },
  ]

  return (
    <Card className="overflow-hidden border-border/50">
      <CardContent className="flex flex-col gap-3 p-4">
        {rows.map((row) => {
          const isA = row.choice === "A"
          const isSelected = item.user_choice === row.choice
          const isWinner = winner === row.choice
          return (
            <div
              key={row.choice}
              className={cn(
                "flex flex-col gap-1.5 rounded-xl border p-2.5 transition-colors",
                isA
                  ? "border-sky-500/15 bg-sky-500/5"
                  : "border-rose-500/15 bg-rose-500/5",
                isSelected && (isA ? "border-sky-500/50" : "border-rose-500/50"),
                !isSelected && !isWinner && "opacity-90"
              )}
            >
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "relative flex size-5 shrink-0 items-center justify-center rounded-md text-xs font-bold text-white",
                    isA ? "bg-sky-500" : "bg-rose-500"
                  )}
                >
                  {row.choice}
                </span>
                <span className="min-w-0 flex-1 text-sm font-medium leading-tight">
                  <span className="line-clamp-2">{row.option}</span>
                </span>
                <div className="flex shrink-0 items-center gap-1.5">
                  {isWinner && <Crown className="size-3.5 text-yellow-400" />}
                  {isSelected && (
                    <span className="flex items-center gap-0.5 rounded-full bg-emerald-500 px-1.5 py-0.5 text-[0.6rem] font-bold text-white">
                      <Check className="size-2.5" />
                      TÚ
                    </span>
                  )}
                  <span
                    className={cn(
                      "text-sm font-bold tabular-nums",
                      isA ? "text-sky-400" : "text-rose-400"
                    )}
                  >
                    {row.percentage}%
                  </span>
                </div>
              </div>
              <Progress value={row.percentage}>
                <ProgressTrack className="h-1.5">
                  <ProgressIndicator
                    className={isA ? "bg-sky-500" : "bg-rose-500"}
                  />
                </ProgressTrack>
              </Progress>
            </div>
          )
        })}
        <div className="flex items-center justify-between gap-2 pt-0.5">
          <span className="flex items-center gap-1.5 text-[0.7rem] text-muted-foreground">
            <ImageIcon className="size-3 text-muted-foreground/60" />
            {item.total_votes.toLocaleString()} votos
          </span>
          <time className="text-[0.7rem] text-muted-foreground tabular-nums">
            {formatDate(item.created_at)}
          </time>
        </div>
      </CardContent>
    </Card>
  )
}

function HistoryListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="border-border/50">
          <CardContent className="flex flex-col gap-3 p-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-1.5 w-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-1.5 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("es", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso))
}