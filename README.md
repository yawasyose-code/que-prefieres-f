# ¿Qué prefieres? — Frontend

Juego de "¿Qué prefieres?" (This or That). El usuario elige entre una opción A y una opción B, ve el resultado en vivo (porcentajes) y acumula historial de votos. **Sin registro**: cada jugador es identificado de forma anónima por un UUID generado en el navegador.

Frontend en React 19 + Vite (Tailwind CSS v4 + shadcn/ui). Consume la API del backend NestJS en `../backend` (repositorio separado).

## Stack

- **React 19** + **TypeScript**
- **Vite 8** con plugin de Tailwind CSS v4
- **shadcn/ui** (`@base-ui/react`) + `lucide-react`
- **TanStack Query** (estado de servidor / caché de API)
- **React Router 7** — rutas: `/`, `/jugar`, `/historial`
- **Tailwind CSS v4** con `tw-animate-css`

## Requisitos

- Node.js 20+
- Backend corriendo en `http://localhost:3000` (ver repo `backend`)

## Setup local

```bash
npm install
npm run dev
```

Abre http://localhost:5173. En desarrollo la API se consume por el proxy de Vite (`/api` → `http://localhost:3000`), así que no hace falta configurar nada más.

## Variables de entorno

Copia `.env.example` a `.env` solo si el backend no está en localhost:

```bash
# URL base completa de la API, incluido el prefijo /api/v1
VITE_API_BASE=https://mi-backend.example.com/api/v1
```

Si `VITE_API_BASE` está vacío o no existe, se usa `/api/v1` (proxy de desarrollo). En producción define la URL de la API desplegada.

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (`tsc -b && vite build`) |
| `npm run preview` | Previsualizar el build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript sin generar archivos |
| `npm run format` | Prettier |

## Estructura

```
src/
├── views/          # Páginas: inicio, juego y historial
├── components/     # Resultado de votación, layout, theme
├── components/ui/  # Componentes shadcn/ui
└── lib/
    ├── api.ts      # Cliente HTTP (x-user-id + VITE_API_BASE)
    ├── types.ts    # Tipos de la API (fuente: backend)
    ├── hooks.ts    # Hooks de TanStack Query
    ├── user-id.ts  # UUID anónimo persistido en localStorage
    └── utils.ts    # Utils (cn)
```

## Seguridad del jugador

Cada petición envía el header `x-user-id` con un UUID guardado en `localStorage` (`qp-user-id`). Si se borra el almacenamiento, se genera uno nuevo y el historial se reinicia.

## Deploy

Build estático (opcional) y configura `VITE_API_BASE` con la URL del backend desplegado. Recordar incluir el origen del frontend en `CORS_ORIGINS` del backend.