import {
  Button,
  FieldError,
  Input,
  InputGroup,
  Label,
  TextField
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loginSchema } from "../../lib/schemas";

export const Route = createFileRoute("/auth/login")({
  component: LoginPage,
});

function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: { email: "", password: ""},
    validators: { onSubmit: loginSchema, onBlurAsync: loginSchema },
    onSubmit: async ({ value }) => {
      console.log("Login submitted:", value);
      setIsSuccess(true);
    },
  });

 



  // Redirect to /users after 1 second if login is successful
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.navigate({ to: "/users" as string });
      }, 1000); // 1 seconds
      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  //Success message page
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-green-600">
            Login Successful!
          </h2>
          <p className="text-gray-500 mt-2">Redirecting you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h1>
        <p className="text-gray-500 text-sm mb-6">Login to your account</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <form.Field
            name="email"
          >
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
                    placeholder="you@example.com"
                    maxLength={254}
                    value={field.state.value}
                    onBlur={field.handleBlur} //field.handleBlur is used to mark the field as touched and trigger validation when the input loses focus.
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError>{errors[0]?.message}</FieldError>
                </TextField>
              );
            }}
          </form.Field>

          {/* Password */}
          <form.Field
            name="password"
          >
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <TextField isInvalid={errors.length > 0 && isTouched} name="password">
                  <Label>Password</Label>
                  <InputGroup>
                    <InputGroup.Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      maxLength={128}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <InputGroup.Suffix>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 text-xs px-2 focus:outline-none"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </InputGroup.Suffix>
                  </InputGroup>
                  <FieldError>{errors[0]?.message}</FieldError>
                </TextField>
              );
            }}
          </form.Field>

       

          <Button type="submit" className="mt-2 w-full">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Don't have an account?{" "}
          <Link
            to="/auth/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
