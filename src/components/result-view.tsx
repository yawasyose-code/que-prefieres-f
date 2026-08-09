import { Check, Crown, Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress"
import type { QuestionResponse, VoteChoice } from "@/lib/types"

export function ResultView({ question }: { question: QuestionResponse }) {
  const choice: VoteChoice | null = question.user_choice

  const rows: {
    choice: VoteChoice
    option: string
    votes: number
    percentage: number
    image?: string | null
  }[] = [
    {
      choice: "A",
      option: question.option_a,
      votes: question.votes_a,
      percentage: question.percentage_a,
      image: question.image_url_a,
    },
    {
      choice: "B",
      option: question.option_b,
      votes: question.votes_b,
      percentage: question.percentage_b,
      image: question.image_url_b,
    },
  ]

  const winner: VoteChoice | null =
    question.percentage_a === question.percentage_b
      ? null
      : question.percentage_a > question.percentage_b
        ? "A"
        : "B"

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-6">
      {rows.map((row) => {
        const isA = row.choice === "A"
        const isWinner = winner === row.choice
        const isSelected = choice === row.choice
        return (
          <div
            key={row.choice}
            className={cn(
              "relative flex w-full flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-200",
              isA
                ? "border-sky-500/25"
                : "border-rose-500/25",
              isWinner &&
                (isA
                  ? "border-sky-500/70 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.4)]"
                  : "border-rose-500/70 shadow-[0_8px_40px_-12px_rgba(244,63,94,0.4)]"),
              !isWinner && "opacity-80"
            )}
          >
            {isSelected && (
              <span className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[0.65rem] font-bold text-white shadow-lg">
                <Check className="size-3" />
                TÚ
              </span>
            )}

            <div className="relative h-24 w-full shrink-0 overflow-hidden sm:h-36 md:h-56 lg:h-100">
              {row.image ? (
                <img
                  src={row.image}
                  alt={row.option}
                  loading="lazy"
                  className="size-full object-cover"
                />
              ) : (
                <div
                  className={cn(
                    "flex size-full items-center justify-center",
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
                  "absolute top-3 left-3 flex size-7 items-center justify-center gap-1 rounded-lg text-sm font-extrabold text-white shadow-lg sm:size-11 sm:text-lg",
                  isA ? "bg-sky-500" : "bg-rose-500"
                )}
              >
                {row.choice}
                {isWinner && <Crown className="size-3.5 text-yellow-300" />}
              </span>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3">
                <span className="line-clamp-2 text-sm leading-snug font-semibold text-balance md:text-lg">
                  {row.option}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-xl font-extrabold tabular-nums sm:text-2xl",
                    isA ? "text-sky-400" : "text-rose-400"
                  )}
                >
                  {row.percentage}%
                </span>
              </div>
              <Progress value={row.percentage}>
                <ProgressTrack className="h-2.5">
                  <ProgressIndicator
                    className={isA ? "bg-sky-500" : "bg-rose-500"}
                  />
                </ProgressTrack>
              </Progress>
              <p className="text-xs text-muted-foreground tabular-nums">
                {row.votes.toLocaleString()} votos
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}