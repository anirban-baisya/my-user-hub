const BASE = 'https://6a3a60bd917c7b14c74d67a0.mockapi.io/api/v1'

// ─── Types ──────>>>>>
export type UserT = {
  id: string        // MockAPI uses string IDs
  email: string
  first_name: string
  last_name: string
  avatar: string
  createdAt: string
}

export type UsersResponseT = {
  data: UserT[]
  total: number
  page: number
  per_page: number
  total_pages: number
}

export type UserPayloadT = {
  first_name: string
  last_name: string
  email: string
}

// ─── Fetcher ───────>>>>
async function fetcher<T>(path: string, opts: RequestInit = {}): Promise<T> { //T is a generic type parameter — a placeholder for any type you'll specify later.
  /*
    <T> — says "I'll accept any type"
    Promise<T> — returns a Promise that resolves to whatever type T is
    When i call it:
    // T = UserT
    const user = await fetcher<UserT>('/users?page=1&limit=6')  // returns Promise<UserT>
  */

  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      'Content-Type': 'application/json',
      ...(opts.headers ?? {}),
    },
  })
  if (!res.ok) throw new Error(await res.text())
  if (res.status === 204) return undefined as T
  return res.json()
}


// ─── API Functions ────>>>>
export async function fetchUsersApi(page = 1, per_page = 6): Promise<UsersResponseT> {
  /*Promise<UsersResponseT> is an explicit annotation that tells TypeScript:
    this function returns a promise after the api call
    the resolved value inside the promise is UsersResponseT
  */

  // MockAPI supports ?page=1&limit=6 and returns array
  // fetch total separately to calculate total_pages because MockAPI doesn't give total_pages

  const [data, all] = await Promise.all([
    fetcher<UserT[]>(`/users?page=${page}&limit=${per_page}`),
    fetcher<UserT[]>(`/users`),
  ])
  return {
    data,
    total: all.length, // total number of users without pagination
    page,
    per_page,
    total_pages: Math.ceil(all.length / per_page),
  }
}


// GET {BASE_URL}/users/{id}
export function fetchUserByIdApi(id: string): Promise<UserT> {
  return fetcher<UserT>(`/users/${id}`)
}

// POST {BASE_URL}/users
export function createUserApi(payload: UserPayloadT): Promise<UserT> {
  return fetcher<UserT>('/users', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

// PUT {BASE_URL}/users/{id}
export function updateUserApi(id: string, payload: Partial<UserPayloadT>): Promise<UserT> {
  return fetcher<UserT>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

// DELETE {BASE_URL}/users/{id}
export function deleteUserApi(id: string): Promise<void> {
  return fetcher<void>(`/users/${id}`, { method: 'DELETE' })
}