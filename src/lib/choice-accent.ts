import type { VoteChoice } from "@/lib/types"

/** Clases de acento (sky/rose) para una opción del duelo. */
export function choiceAccent(choice: VoteChoice) {
  const isA = choice === "A"
  return {
    isA,
    badge: isA ? "bg-sky-500" : "bg-rose-500",
    text: isA ? "text-sky-400" : "text-rose-400",
    textSoft: isA ? "text-sky-300" : "text-rose-300",
    bar: isA ? "bg-sky-500" : "bg-rose-500",
    washHover: isA ? "group-hover:bg-sky-500/10" : "group-hover:bg-rose-500/10",
    borderHover: isA
      ? "group-hover:border-sky-400/80"
      : "group-hover:border-rose-400/80",
    fallback: isA
      ? "bg-gradient-to-br from-sky-600/50 via-sky-500/15 to-transparent"
      : "bg-gradient-to-br from-rose-600/50 via-rose-500/15 to-transparent",
  }
}
