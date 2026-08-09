// Tipos de respuesta de la API del backend @backend
// Referencia: backend/src/questions/dto/question-response.dto.ts

export type VoteChoice = "A" | "B"

export interface QuestionResponse {
  id: string
  option_a: string
  option_b: string
  votes_a: number
  votes_b: number
  total_votes: number
  percentage_a: number
  percentage_b: number
  user_choice: VoteChoice | null
  image_url_a?: string | null
  image_url_b?: string | null
}

// Referencia: backend/src/votes/votes.service.ts (VoteHistoryRow)
// Cada ítem del historial es una pregunta completa + metadatos del voto.
export interface HistoryItem extends QuestionResponse {
  question_id: string
  created_at: string
}