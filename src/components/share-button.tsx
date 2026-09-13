import { useEffect, useRef, useState } from "react"
import { Check, Share2 } from "lucide-react"

import { cn } from "@/lib/utils"

const SHARE_URL = "https://que-prefieres-f.onrender.com/"
const SHARE_TITLE = "¿Qué prefieres?"
const SHARE_TEXT = "Dos opciones. Un solo voto. Sin escapatoria. ¿Qué prefieres tú?"

export function ShareButton({ className }: { className?: string }) {
  const [copied, setCopied] = useState(false)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  const handleShare = async () => {
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: SHARE_TITLE,
          text: SHARE_TEXT,
          url: SHARE_URL,
        })
      } catch (error) {
        // AbortError = el usuario canceló la hoja de compartir; no es un error real
        if (error instanceof DOMException && error.name === "AbortError") return
      }
      return
    }

    try {
      await navigator.clipboard.writeText(SHARE_URL)
      setCopied(true)
      if (timeout.current) clearTimeout(timeout.current)
      timeout.current = setTimeout(() => setCopied(false), 2000)
    } catch {
      // Portapapeles no disponible (contexto inseguro): no hay feedback extra
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleShare()}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline",
        className
      )}
    >
      {copied ? (
        <>
          <Check className="size-4 text-emerald-500" />
          ¡Enlace copiado!
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          Compartir
        </>
      )}
    </button>
  )
}
