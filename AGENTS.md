# AGENTS.md

Frontend React 19 + Vite (Tailwind + shadcn) para el juego "¿Qué prefieres?". Consume el backend NestJS ubicado en `../backend`, que es la única fuente de verdad de la API. No se escribe en Supabase desde el frontend: todos los votos y lecturas de juego van por la API del backend.

## Backend / API (referencia: `@backend`)

- Base URL: `http://localhost:3000/api/v1/...` (prefijo `api` + versión `v1`, sin versión en el path).
- Header obligatorio en TODAS las peticiones: `x-user-id` con un UUID (identifica jugador anónimo). Falta o no es UUID → `400` con `message: "Header \"x-user-id\" (uuid) es requerido"`.
- Usuario anónimo: generar y persistir un UUID por dispositivo; reutilizarlo para que el historial sea coherente.

### Endpoints

- `GET /questions/random` — pregunta aleatoria activa.
- `GET /questions/:id` — pregunta + resultado.
- `POST /questions/:id/vote` body `{"choice": "A" | "B"}` — registra el voto y devuelve la pregunta actualizada. Cualquier otro `choice` → `400`. Votar dos veces la misma pregunta → `409`.
- `GET /users/me/history` — historial de votos del `x-user-id` (array con `question_id` y `created_at`).

### Forma de una pregunta (respuesta de la API)

```
{
  id: string,
  option_a: string,
  option_b: string,
  image_url_a: string | null,
  image_url_b: string | null,
  votes_a: number,
  votes_b: number,
  total_votes: number,
  user_choice: "A" | "B" | null,
  percentage_a: number,
  percentage_b: number
}
```

Nota: `percentage_a + percentage_b` puede no sumar 100 por redondeo.

### Errores

Formato: `{"statusCode", "message", "error", "timestamp"}`. `message` puede ser `string` o `string[]` (validación DTO).

## Directivas para el agente

- Antes de implementar llamadas, tipos de respuesta o servicios que consuman la API, leer `backend/AGENTS.md` y los DTO del backend (`backend/src/**/dto/*`) vía la referencia `backend`.
- Mantener la fuente de verdad en el backend: si un comportamiento del juego no coincide (porcentajes, doble voto, historial), verificarlo contra `backend/src/questions` y `backend/src/votes` antes de asumir.
- No duplicar la definición de tipos del backend sin marcar que proviene de `@backend`.