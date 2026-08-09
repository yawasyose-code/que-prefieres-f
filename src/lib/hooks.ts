import { useMutation, useQuery } from "@tanstack/react-query"
import { ApiError, getHistory, getQuestion, getRandomQuestion, vote } from "@/lib/api"
import type { VoteChoice } from "@/lib/types"

export function useRandomQuestion() {
  return useQuery({
    queryKey: ["question", "random"],
    queryFn: getRandomQuestion,
  })
}

export function useQuestion(id: string | undefined) {
  return useQuery({
    queryKey: ["question", id],
    queryFn: () => getQuestion(id!),
    enabled: Boolean(id),
  })
}

export function useVote() {
  return useMutation({
    mutationFn: ({ id, choice }: { id: string; choice: VoteChoice }) =>
      vote(id, choice),
  })
}

export function useHistory() {
  return useQuery({
    queryKey: ["history"],
    queryFn: getHistory,
  })
}

export function isConflict(error: unknown): error is ApiError {
  return error instanceof ApiError && error.status === 409
}

export function isNoMoreQuestions(error: unknown): error is ApiError {
  return (
    error instanceof ApiError &&
    error.status === 404 &&
    error.message.includes("No quedan")
  )
}