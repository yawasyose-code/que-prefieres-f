import { getUserId } from "@/lib/user-id"
import type { HistoryItem, QuestionResponse, VoteChoice } from "@/lib/types"

const API_BASE = "/api/v1"

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": getUserId(),
      ...init?.headers,
    },
  })

  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message =
      Array.isArray(body?.message) ? body.message.join(", ")
      : typeof body?.message === "string" ? body.message
      : `Error ${response.status}`
    throw new ApiError(response.status, message)
  }

  return response.json() as Promise<T>
}

export function getRandomQuestion() {
  return request<QuestionResponse>("/questions/random")
}

export function getQuestion(id: string) {
  return request<QuestionResponse>(`/questions/${id}`)
}

export function vote(id: string, choice: VoteChoice) {
  return request<QuestionResponse>(`/questions/${id}/vote`, {
    method: "POST",
    body: JSON.stringify({ choice }),
  })
}

export function getHistory() {
  return request<HistoryItem[]>("/users/me/history")
}