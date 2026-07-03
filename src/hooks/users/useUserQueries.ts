import { useMutation, useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import {
  fetchUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  type UserPayloadT,
} from '../../lib/api'

export function useUsers(page: number, per_page: number) {
  return useQuery({
    queryKey: ['users', page, per_page],
    queryFn: () => fetchUsersApi(page, per_page),
    placeholderData: keepPreviousData,
    staleTime: 5 * 1000, // 5 seconds - staleTime to tune how often background refetches happen 
  })
}

export function useCreateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UserPayloadT) => createUserApi(payload),
    // **  invalidateQueries inside onSuccess tells TanStack Query to refetch any cached ['users'] queries(by refetching useUsers query ) so the table reflects server changes / latest data after a user is created
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserPayloadT }) =>
      updateUserApi(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useDeleteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteUserApi(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}