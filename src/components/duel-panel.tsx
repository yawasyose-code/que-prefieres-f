import { Image as ImageIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { choiceAccent } from "@/lib/choice-accent"
import type { VoteChoice } from "@/lib/types"

/** Imagen de fondo a pantalla completa (o fallback en gradiente) de un panel de duelo. */
export function DuelMedia({
  image,
  alt,
  choice,
  className,
}: {
  image?: string | null
  alt: string
  choice: VoteChoice
  className?: string
}) {
  const accent = choiceAccent(choice)

  if (image) {
    return (
      <img
        src={image}
        alt={alt}
        loading="lazy"
        className={cn("absolute inset-0 size-full object-cover", className)}
      />
    )
  }

  return (
    <div
      className={cn(
        "absolute inset-0 flex items-center justify-center",
        accent.fallback,
        className
      )}
    >
      <ImageIcon className="size-16 text-muted-foreground/30 sm:size-24" />
    </div>
  )
}

/** Badge de letra (A / B) de una opción del duelo. */
export function ChoiceBadge({
  choice,
  className,
  children,
}: {
  choice: VoteChoice
  className?: string
  children?: React.ReactNode
}) {
  const accent = choiceAccent(choice)
  return (
    <span
      className={cn(
        "flex size-10 items-center justify-center gap-1 rounded-xl text-lg font-extrabold text-white shadow-lg sm:size-12 sm:text-xl",
        accent.badge,
        className
      )}
    >
      {choice}
      {children}
    </span>
  )
}
