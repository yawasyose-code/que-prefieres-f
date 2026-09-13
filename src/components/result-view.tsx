import { useEffect, useState } from "react"
import { Check, Crown } from "lucide-react"

import { cn } from "@/lib/utils"
import { useCountUp } from "@/lib/use-count-up"
import { ChoiceBadge, DuelMedia } from "@/components/duel-panel"
import { choiceAccent } from "@/lib/choice-accent"
import type { QuestionResponse, VoteChoice } from "@/lib/types"

/**
 * Resultado del duelo: dos paneles a pantalla dividida.
 * IMPORTANTE: debe renderizarse como hijo directo de un grid
 * `grid-rows-2 md:grid-cols-2` (los paneles se reparten el espacio).
 */
export function ResultView({ question }: { question: QuestionResponse }) {
  const winner: VoteChoice | null =
    question.percentage_a === question.percentage_b
      ? null
      : question.percentage_a > question.percentage_b
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

  return (
    <>
      {rows.map((row) => (
        <ResultPanel
          key={row.choice}
          row={row}
          isSelected={question.user_choice === row.choice}
          isWinner={winner === row.choice}
          isDimmed={winner !== null && winner !== row.choice}
        />
      ))}
    </>
  )
}

function ResultPanel({
  row,
  isSelected,
  isWinner,
  isDimmed,
}: {
  row: {
    choice: VoteChoice
    option: string
    votes: number
    percentage: number
    image?: string | null
  }
  isSelected: boolean
  isWinner: boolean
  isDimmed: boolean
}) {
  const accent = choiceAccent(row.choice)
  const percentage = useCountUp(row.percentage)
  const [barReady, setBarReady] = useState(false)

  useEffect(() => {
    const frame = requestAnimationFrame(() => setBarReady(true))
    return () => cancelAnimationFrame(frame)
  }, [])

  return (
    <div className="relative min-h-0 overflow-hidden">
      <DuelMedia
        image={row.image}
        alt={row.option}
        choice={row.choice}
        className={cn(
          "transition-all duration-700",
          isDimmed && "opacity-50 saturate-50"
        )}
      />

      {/* Marco del ganador */}
      {isWinner && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-10 border-4",
            accent.isA ? "border-sky-400/70" : "border-rose-400/70"
          )}
        />
      )}

      {/* Badge de opción */}
      <ChoiceBadge
        choice={row.choice}
        className="absolute top-4 left-4 z-10 animate-in fade-in zoom-in-50 duration-300"
      >
        {isWinner && <Crown className="size-4 fill-yellow-300 text-yellow-300 sm:size-5" />}
      </ChoiceBadge>

      {/* Badge "TÚ" */}
      {isSelected && (
        <span className="absolute top-4 right-4 z-10 flex animate-in items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-bold text-white shadow-lg zoom-in-50 fade-in duration-300 [animation-delay:200ms]">
          <Check className="size-3.5" />
          TÚ
        </span>
      )}

      {/* Overlay de resultados */}
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-4 pt-16 sm:p-6 sm:pt-20 md:p-8 md:pt-24">
        <span
          className={cn(
            "text-xs font-bold tracking-widest uppercase",
            accent.textSoft
          )}
        >
          Opción {row.choice}
        </span>
        <span className="line-clamp-2 text-lg leading-tight font-bold text-balance text-white sm:text-xl md:text-2xl">
          {row.option}
        </span>
        <div className="mt-1 flex items-end justify-between gap-3">
          <span
            className={cn(
              "text-5xl leading-none font-black tabular-nums sm:text-6xl md:text-7xl",
              accent.textSoft
            )}
          >
            {percentage}%
          </span>
          <span className="pb-1 text-xs font-medium text-white/70 tabular-nums sm:text-sm">
            {row.votes.toLocaleString()} votos
          </span>
        </div>
      </div>

      {/* Barra de progreso en el borde inferior */}
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/15">
        <div
          className={cn(
            "h-full transition-[width] duration-1000 ease-out",
            accent.bar
          )}
          style={{ width: barReady ? `${row.percentage}%` : "0%" }}
        />
      </div>
    </div>
  )
}
