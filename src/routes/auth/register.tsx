import {
  Button,
  FieldError,
  Input,
  InputGroup,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { useForm } from "@tanstack/react-form";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { countries } from "../../lib/countries";
import { otpSchema, registerSchema } from "../../lib/schemas";

export const Route = createFileRoute("/auth/register")({
  component: RegisterPage,
});

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      country: "",
      mobile: "",
    },
    validators: { onSubmit: registerSchema, onBlurAsync: registerSchema },
    onSubmit: async ({ value }) => {
      if (!otpSent) {
        setOtpError("Please send and verify OTP first");
        return;
      }
      if (!otpVerified) {
        setOtpError("Please verify your OTP before registering");
        return;
      }
      setOtpError("");
      console.log("Register submitted:", value);
      setIsSuccess(true);
    },
  });

  const otpForm = useForm({
    defaultValues: { otp: "" },
    validators: { onSubmit: otpSchema },
    onSubmit: async ({ value }) => {
      console.log("OTP verified:", value.otp);
      setOtpVerified(true);
      setOtpError(""); // ← clear error on verify
      setShowOtp(false);
    },
  });

  //   const handleSendOtp = async () => {
  //     // touch all fields
  //     // 'as const' tells TypeScript to treat this as a tuple of exact string literals
  //     // instead of string[] — required so TanStack Form can match these against
  //     // the exact field names defined in defaultValues
  //     const fields = ["name", "email", "password", "country", "mobile"] as const;
  //     fields.forEach((field) => {
  //       form.setFieldMeta(field, (meta) => ({ ...meta, isTouched: true }));
  //     });

  //     // validate all fields
  //     const results = await Promise.all(
  //       fields.map((field) => form.validateField(field, "blur")),
  //     );
  // console.log(results, '<-- raw results')

  //     // if any field has errors, stop
  //     // console.log(results.some((errors) => errors.length > 0) , '---->>>');
  //     if (results.some((errors) => errors.length > 0)) return;

  //     setOtpSent(true);
  //     setShowOtp(true);
  //   };

  const handleSendOtp = async () => {
    // 'as const' tells TypeScript to treat this as a tuple of exact string literals
    // instead of string[] — required so TanStack Form can match these against
    // the exact field names defined in defaultValues
    const fields = ["name", "email", "password", "country", "mobile"] as const;

    // touch all fields
    fields.forEach((field) => {
      form.setFieldMeta(field, (meta) => ({ ...meta, isTouched: true }));
    });

    // trigger validation (return value unreliable, ignore it)
    await Promise.all(fields.map((field) => form.validateField(field, "blur")));

    // read errors from actual field state after validation runs
    const hasErrors = fields.some((field) => {
      const fieldState = form.getFieldMeta(field);
      return (fieldState?.errors?.length ?? 0) > 0;
    });

    console.log(hasErrors, "<-- hasErrors");

    if (hasErrors) return;

    setOtpSent(true);
    setShowOtp(true);
  };

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
            Registration Successful!
          </h2>
          <p className="text-gray-500 mt-2">Your account has been created.</p>
          <p className="text-gray-500 mt-2">Redirecting you...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Create account
        </h1>
        <p className="text-gray-500 text-sm mb-6">Register to get started</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          {/* Name */}
          <form.Field name="name">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <TextField
                  isInvalid={errors.length > 0 && isTouched}
                  name="name"
                  type="text"
                >
                  <Label>Full Name</Label>
                  <Input
                    placeholder="Anirban Baisya"
                    maxLength={100}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError>{errors[0]?.message}</FieldError>
                </TextField>
              );
            }}
          </form.Field>

          {/* Email */}
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
                    maxLength={254}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldError>{errors[0]?.message}</FieldError>
                </TextField>
              );
            }}
          </form.Field>

          {/* Password */}
          <form.Field name="password">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <TextField
                  isInvalid={errors.length > 0 && isTouched}
                  name="password"
                >
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

          {/* Country */}
          <form.Field name="country">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <Select
                  onBlur={field.handleBlur}
                  value={field.state?.value}
                  onChange={(val) => field.handleChange(val as string)}
                  placeholder="Select your country"
                  isInvalid={errors.length > 0 && isTouched}
                >
                  <Label>Country</Label>
                  <Select.Trigger>
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      {countries.map((c) => (
                        <ListBox.Item
                          key={c.iso}
                          id={c.iso}
                          textValue={`${c.name} (${c.code})`}
                        >
                          {c.name} ({c.code})
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  <FieldError>{errors[0]?.message}</FieldError>
                </Select>
              );
            }}
          </form.Field>

          {/* Mobile */}
          <form.Field name="mobile">
            {(field) => {
              const { errors, isTouched } = field.state.meta;
              return (
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <TextField
                      isInvalid={errors.length > 0 && isTouched}
                      name="mobile"
                      type="tel"
                    >
                      <Label>Mobile Number</Label>
                      <Input
                        placeholder="9876543210"
                        maxLength={15}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError>{errors[0]?.message}</FieldError>
                    </TextField>
                  </div>
                  <Button
                    type="button"
                    variant="secondary"
                    className="mt-6"
                    onPress={handleSendOtp}
                  >
                    {otpSent ? "Resend" : "Send OTP"}
                  </Button>
                </div>
              );
            }}
          </form.Field>

          {/* OTP Flow */}
          {showOtp && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col gap-3">
              <p className="text-sm text-blue-700 font-medium">
                Enter the 4-digit OTP sent to your mobile
              </p>
              <otpForm.Field name="otp">
                {(field) => {
                  const { errors } = field.state.meta;
                  return (
                    <TextField
                      isInvalid={errors.length > 0}
                      name="otp"
                      type="text"
                    >
                      <Label>OTP</Label>
                      <Input
                        maxLength={4}
                        placeholder="••••"
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError>{errors[0]?.message}</FieldError>
                    </TextField>
                  );
                }}
              </otpForm.Field>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  onPress={() => otpForm.handleSubmit()}
                >
                  Verify OTP
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onPress={() => setShowOtp(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {otpError && <p className="text-red-500 text-sm">{otpError}</p>}

          <Button type="submit" className="mt-2 w-full">
            Register
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
