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
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useCreateUser } from "../../hooks/users/useUserQueries";
import { fetchUsersApi } from "../../lib/api";
import { addUserSchema } from "../../lib/schemas";

export const Route = createFileRoute("/users/add")({
  component: AddUserPage,
});

function AddUserPage() {
  const router = useRouter();
  const { mutate, isPending, isError, error } = useCreateUser();

  const form = useForm({
    defaultValues: { first_name: "", last_name: "", email: "" },
    validators: { onSubmit: addUserSchema, onBlurAsync: addUserSchema },
    onSubmit: async ({ value }) => {
      mutate(value, {
        onSuccess: async () => {
          const per_page = 6; // or whatever your default is

          // fetch fresh data directly from the API
          const latest = await fetchUsersApi(1, per_page);
          const lastPage = latest?.total_pages ?? 1;

          router.navigate({
            to: "/users/" as string,
            search: { page: lastPage, per_page } as any,
          });
        },
      });
    },
  });

  return (
    <div className="p-6 max-w-lg mx-auto">
      <Link href="/users" className="text-sm text-blue-600 hover:underline">
        ← Back to Users
      </Link>
      <h1 className="text-xl font-semibold mt-2 mb-6">Add User</h1>

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

        {isError && (
          <p className="text-red-500 text-sm">{(error as Error).message}</p>
        )}

        <div className="flex gap-3 justify-end mt-2">
          <Button
            onClick={() => router.navigate({ to: "/users" as string })}
            variant="secondary"
            type="button"
          >
            Cancel
          </Button>
          <Button type="submit" isPending={isPending}>
            {({ isPending }) => (
              <>
                {isPending && <Spinner size="sm" color="current" />}
                {isPending ? "Adding..." : "Add User"}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
