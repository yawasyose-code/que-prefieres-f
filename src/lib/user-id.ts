const USER_ID_KEY = "qp-user-id"

export function getUserId(): string {
  const stored = localStorage.getItem(USER_ID_KEY)
  if (stored) {
    return stored
  }

  const id = crypto.randomUUID()
  localStorage.setItem(USER_ID_KEY, id)
  return id
}