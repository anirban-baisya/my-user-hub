import {
  Button,
  FieldError,
  Input,
  Label,
  Link,
  Spinner,
  TextField,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useUpdateUser } from "../../hooks/users/useUserQueries";
import { fetchUserByIdApi } from "../../lib/api";
import { updateUserSchema } from "../../lib/schemas";

export const Route = createFileRoute("/users/$id/update")({
  // Read from_page and per_page from URL search params
  // These are passed from the users list page when clicking Edit
  // so we can return the user to the exact same page after updating
  validateSearch: (search) => ({
    from_page: Number(search.from_page ?? 1),
    per_page: Number(search.per_page ?? 6),
  }),
  component: UpdateUserPage,
});

function UpdateUserPage() {
  const { id } = Route.useParams();
  const { from_page, per_page } = Route.useSearch(); // from_page: the page number the user was on before navigating here // per_page: the page size, kept consistent across navigation

  const router = useRouter();
  const updateMutation = useUpdateUser();

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => fetchUserByIdApi(id),
  });

  const form = useForm({
    defaultValues: {
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
    },
    validators: { onSubmit: updateUserSchema, onBlurAsync: updateUserSchema },
    onSubmit: async ({ value }) => {
      updateMutation.mutate(
        { id: id, payload: value },
        {
          onSuccess: async () => {
            // await sleep({ seconds: 5 });
            router.navigate({
              to: "/users" as string,
              // Navigate back to the same page the user came from
              // instead of always going to page 1
              search: { page: from_page, per_page } as any, // ← go back to same page
            });
          },
        },
      );
    },
  });

  if (isLoading)
    return <p className="p-8 text-center text-gray-500">Loading user...</p>;
  if (isError || !user)
    return <p className="p-8 text-center text-red-500">Failed to load user.</p>;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Link href="/users" className="text-sm text-blue-600 hover:underline">
        ← Back to Users
      </Link>
      <h1 className="text-xl font-semibold mt-2 mb-1">Update User</h1>
      <p className="text-gray-500 text-sm mb-6">
        {user.first_name} {user.last_name}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex flex-col gap-4"
      >
        <form.Field name="first_name">
          {(field) => {
            const { errors, isTouched } = field.state.meta;
            return (
              <TextField
                isInvalid={errors.length > 0 && isTouched}
                name="first_name"
              >
                <Label>First Name</Label>
                <Input
                  placeholder="Anirban"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError>{errors[0]?.message}</FieldError>
              </TextField>
            );
          }}
        </form.Field>

        <form.Field name="last_name">
          {(field) => {
            const { errors, isTouched } = field.state.meta;
            return (
              <TextField
                isInvalid={errors.length > 0 && isTouched}
                name="last_name"
              >
                <Label>Last Name</Label>
                <Input
                  placeholder="Baisya"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError>{errors[0]?.message}</FieldError>
              </TextField>
            );
          }}
        </form.Field>

        <form.Field name="email">
          {(field) => {
            const { errors, isTouched } = field.state.meta;
            return (
              <TextField
                isInvalid={errors.length > 0 && isTouched}
                name="email"
                type="email"
              >
                <Label>Email</Label>
                <Input
                  placeholder="anirban@example.com"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldError>{errors[0]?.message}</FieldError>
              </TextField>
            );
          }}
        </form.Field>

        {updateMutation.isError && (
          <p className="text-red-500 text-sm">
            {(updateMutation.error as Error).message}
          </p>
        )}

        <div className="flex gap-3 justify-end mt-2">
          <Button
            onClick={() => router.navigate({ to: "/users" as string })}
            variant="secondary"
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" isPending={updateMutation.isPending}>
            {({ isPending }) => (
              <>
                {isPending && <Spinner size="sm" color="current" />}
                {isPending ? "Updating..." : "Update User"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
