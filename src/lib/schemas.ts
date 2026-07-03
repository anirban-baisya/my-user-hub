import { z } from "zod";

export const loginSchema = z.object({
//   email: z.string().min(1, "Email is required").email("Invalid email address"),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
 
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.email("Invalid email address").min(1, "Email is required"),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  country: z.string().min(1, 'Please select a country'),
  mobile: z.string().min(7, 'Enter a valid mobile number').max(15),
})

export const otpSchema = z.object({
  otp: z.string().length(4, "OTP must be 4 digits"),
//    .regex(/^[0-9]+$/, 'OTP must contain only numbers'),
});

export type LoginFormSchemaT = z.infer<typeof loginSchema>;
export type OtpFormSchemaT = z.infer<typeof otpSchema>;
export type RegisterFormSchemaT = z.infer<typeof registerSchema>;



export const addUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email("Invalid email address").min(1, "Email is required"),
})


export const updateUserSchema = z.object({
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  email: z.email("Invalid email address").min(1, "Email is required"),
})