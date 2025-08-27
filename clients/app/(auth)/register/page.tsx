"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { registerUser } from "@/service/authService";
import { Eye, EyeOff } from "lucide-react"; // ✅ removed unused icons
import { motion } from "framer-motion";
import { AxiosError } from "axios";
import { FaSpinner } from "react-icons/fa";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number is too short"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      await registerUser(data);
      setEmailSent(true);
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /\d/.test(password) && /[@$!%*?&]/.test(password)) {
      return "Strong";
    }
    return "Medium";
  };

  if (emailSent) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 rounded-xl shadow-xl bg-white/90 backdrop-blur-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-shop_dark_green">
          🎉 Registration Successful!
        </h2>
        <p className="mb-4 text-gray-600">
          We sent a verification link to your email. Please check your inbox to activate your account.
        </p>
        <Button onClick={() => setEmailSent(false)}>Back to Register</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-shop_light_green via-white to-shop_dark_green">
      <div className="w-full max-w-5xl flex bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Section - Illustration / Branding */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="hidden md:flex w-1/2 bg-gradient-to-br from-shop_dark_green to-shop_light_green text-white flex-col items-center justify-center p-10"
        >
          <h2 className="text-3xl font-bold mb-4">Join Our Shopping platform</h2>
          <p className="text-lg text-center">
            Create your account and explore personalized shopping, quick checkout, and exclusive deals!
          </p>
        </motion.div>

        {/* Right Section - Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full md:w-1/2 p-8"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create an Account</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input placeholder="John Doe" {...register("name")} />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <Label>Email</Label>
              <Input placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <Label>Phone</Label>
              <Input placeholder="+1234567890" {...register("phone")} />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
            </div>

            <div>
              <Label>Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="********"
                  {...register("password")}
                  onChange={(e) => setPasswordStrength(checkPasswordStrength(e.target.value))}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              {passwordStrength && (
                <p
                  className={`text-sm mt-1 ${
                    passwordStrength === "Weak"
                      ? "text-red-500"
                      : passwordStrength === "Medium"
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  Password strength: {passwordStrength}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? <FaSpinner/> : "Register"}
            </Button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <hr className="flex-grow border-gray-300" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
