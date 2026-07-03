import { Button, Modal, Spinner, Table } from "@heroui/react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { useDeleteUser, useUsers } from "../../hooks/users/useUserQueries";

type UsersSearchT = {
  page: number;
  per_page: number;
};

export const Route = createFileRoute("/users/")({
  validateSearch: (search): UsersSearchT => ({
    page: Number(search.page ?? 1),
    per_page: Number(search.per_page ?? 6),
  }),
  component: UsersPage,
});

function UsersPage() {
  const router = useRouter();
  const { page, per_page } = Route.useSearch();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data, isLoading, isError, error } = useUsers(page, per_page);
  const deleteMutation = useDeleteUser();

  const handlePageChange = (newPage: number) => {
    /*
    > from — tells the router "I am currently on this route, update search params relative to here." Search params are merged with existing ones.
    > to — tells the router "navigate to this exact route." Search params are replaced entirely.
    */
    router.navigate({
      from: "/users/",
      search: { page: newPage, per_page } as any,
    });
  };

  if (isLoading) {
    return <p className="p-8 text-center text-gray-500">Loading users...</p>;
  }

  if (isError) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Failed to load users</p>
        <p className="text-gray-400 text-sm mt-1">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Users ({data?.total ?? 0})</h1>
        <Link to="/users/add">
          <Button>Add User</Button>
        </Link>
      </div>

      {/* Empty state OR table */}
      {!data?.data?.length ? (
        <p className="text-center text-gray-400 py-12">No users found.</p>
      ) : (
        <>
          {/* HeroUI v3 Table */}
          <Table>
            <Table.ScrollContainer>
              <Table.Content aria-label="Users table" className="min-w-[600px]">
                <Table.Header>
                  <Table.Column className="font-semibold">Avatar</Table.Column>
                  <Table.Column className="font-semibold">
                    First Name
                  </Table.Column>
                  <Table.Column className="font-semibold">
                    Last Name
                  </Table.Column>
                  <Table.Column className="font-semibold">Email</Table.Column>
                  <Table.Column className="font-semibold">Actions</Table.Column>
                </Table.Header>
                <Table.Body>
                  {data.data.map((user) => (
                    <Table.Row key={user.id}>
                      <Table.Cell>
                        <img
                          src={user.avatar}
                          alt={user.first_name}
                          className="w-8 h-8 rounded-full"
                        />
                      </Table.Cell>
                      <Table.Cell>{user.first_name}</Table.Cell>
                      <Table.Cell>{user.last_name}</Table.Cell>
                      <Table.Cell>{user.email}</Table.Cell>
                      <Table.Cell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onPress={() =>
                              router.navigate({
                                to: "/users/$id/update",
                                params: { id: String(user.id) },

                                // Pass current pagination state as search params so the Edit user page
                                // can navigate back to the same page after a successful update
                                search: { from_page: page, per_page } as any,
                              })
                            }
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onPress={() => setDeleteTargetId(user.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              Page {data.page} of {data.total_pages}
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                isDisabled={page <= 1}
                onPress={() => handlePageChange(page - 1)}
              >
                Prev
              </Button>
              {Array.from({ length: data.total_pages }, (_, i) => i + 1).map(
                (p) => (
                  <Button
                    key={p}
                    size="sm"
                    variant={p === page ? "primary" : "secondary"}
                    onPress={() => handlePageChange(p)}
                  >
                    {p}
                  </Button>
                ),
              )}
              <Button
                size="sm"
                variant="secondary"
                isDisabled={page >= data.total_pages}
                onPress={() => handlePageChange(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteTargetId !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTargetId(null);
        }}
      >
        <Modal.Backdrop>
          <Modal.Container>
            <Modal.Dialog className="md:max-w-md">
              <Modal.CloseTrigger />
              <Modal.Header>
                <Modal.Heading>Delete User</Modal.Heading>
              </Modal.Header>
              <Modal.Body>
                <p className="text-sm text-gray-500">
                  Are you sure? This action cannot be undone.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={() => setDeleteTargetId(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  isPending={deleteMutation.isPending}
                  onPress={() =>
                    deleteMutation.mutate(deleteTargetId!, {
                      onSuccess: () => {
                        // if this was the last item on the page (and not page 1), go back
                        if (data?.data.length === 1 && page > 1) {
                          router.navigate({
                            to: "/users",
                            search: { page: page - 1, per_page } as any,
                          });
                        }
                        setDeleteTargetId(null);
                      },
                    })
                  }
                >
                  {({ isPending }) => (
                    <>
                      {isPending && <Spinner size="sm" color="current" />}
                      {isPending ? "Deleting..." : "Delete"}
                    </>
                  )}
                </Button>
              </Modal.Footer>
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </div>
  );
}
